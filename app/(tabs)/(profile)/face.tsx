import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import api from '@/contexts/axios.instance';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/theme/ThemeProvider';
import { uploadImageToBucket } from '@/services/fileUpload';
import { getFaceEmbeddingFromImage } from '@/services/faceEmbedding';

interface Embedding {
  id: number;
  created_at: string;
  vector_length: number;
  similarity_score?: number;
}

export default function FaceScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [embeddings, setEmbeddings] = useState<Embedding[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // profile image preview
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  /* ---------------- FETCH ---------------- */

  const fetchData = async () => {
    try {
      setLoading(true);
      const [faceRes, profileRes] = await Promise.all([
        api.get(`/face/user/${user!.id}`),
        api.get(`/profiles/${user!.id}`),
      ]);
      setEmbeddings(faceRes.data.embeddings || []);
      setProfileImage(profileRes.data.user_profile_picture || null);
    } catch {
      Alert.alert('Error', 'Failed to load face data');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PROFILE IMAGE ---------------- */

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedProfileImage(result.assets[0].uri);
      setPreviewVisible(true);
    }
  };

  const uploadProfileImage = async () => {
    if (!selectedProfileImage || !user) return;

    setUploading(true);
    try {
      const url = await uploadImageToBucket(
        selectedProfileImage,
        `profile_${user.id}.jpg`
      );

      await api.put(`/profiles/${user.id}`, {
        user_profile_picture: url,
      });

      setProfileImage(url);
      setPreviewVisible(false);
      setSelectedProfileImage(null);
    } catch {
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- FACE EMBEDDINGS ---------------- */

  const pickFaceImage = async () => {
    if (embeddings.length >= 5) {
      Alert.alert('Limit reached', 'Maximum 5 face embeddings allowed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadFaceEmbedding(result.assets[0].uri);
    }
  };

  const captureFaceImage = async () => {
    if (embeddings.length >= 5) {
      Alert.alert('Limit reached', 'Maximum 5 face embeddings allowed');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      await uploadFaceEmbedding(result.assets[0].uri);
    }
  };

  const uploadFaceEmbedding = async (imageUri: string) => {
    if (!user) return;

    setUploading(true);
    try {
      // 1️⃣ get 512D embedding
      const embedding = await getFaceEmbeddingFromImage(imageUri);

      // 2️⃣ upload to backend
      await api.post(`/profiles/${user.id}/face-embeddings`, {
        embedding_vector: embedding,
        model_version: 'adaface-ir101',
      });

      // 3️⃣ refresh
      await fetchData();

      Alert.alert('Success', 'Face added successfully');
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.response?.data?.error ||
        err?.message ||
        'Failed to add face'
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteEmbedding = (id: number) => {
    Alert.alert('Delete face?', 'This cannot be undone', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await api.delete(`/face/embedding/${id}`);
          fetchData();
        },
      },
    ]);
  };

  /* ---------------- RENDER ---------------- */

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      {/* HEADER */}
      <View
        style={{
          paddingTop: insets.top + theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.textPrimary,
          }}
        >
          Face & Profile
        </Text>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
        }}
      >
        {/* PROFILE IMAGE */}
        <Section title="Profile picture">
          <View style={{ alignItems: 'center' }}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require('@/assets/avatar.png')
              }
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: theme.colors.surface,
                marginBottom: 12,
              }}
            />

            <TouchableOpacity
              onPress={pickProfileImage}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 18,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.surface,
              }}
            >
              <Text style={{ color: theme.colors.primary }}>
                Change picture
              </Text>
            </TouchableOpacity>
          </View>
        </Section>

        {/* FACE EMBEDDINGS */}
        <Section title={`Face recognition (${embeddings.length}/5)`}>
          {embeddings.map((e, i) => (
            <View
              key={e.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  color: theme.colors.textPrimary,
                }}
              >
                Face {i + 1}
              </Text>

              <Text
                style={{
                  marginRight: 12,
                  fontSize: 12,
                  color: theme.colors.textSecondary,
                }}
              >
                {e.similarity_score?.toFixed(1)}%
              </Text>

              <TouchableOpacity onPress={() => deleteEmbedding(e.id)}>
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={theme.colors.alert}
                />
              </TouchableOpacity>
            </View>
          ))}

          {embeddings.length < 5 && (
            <View style={{ marginTop: 10 }}>
              <ActionButton
                label="Add from camera"
                onPress={captureFaceImage}
              />
              <ActionButton
                label="Add from gallery"
                onPress={pickFaceImage}
              />
            </View>
          )}
        </Section>
      </ScrollView>

      {/* PROFILE PREVIEW MODAL */}
      <Modal visible={previewVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.85)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: selectedProfileImage! }}
            style={{
              width: 220,
              height: 220,
              borderRadius: 110,
              marginBottom: 20,
            }}
          />

          <View style={{ flexDirection: 'row' }}>
            <ActionButton
              label="Cancel"
              onPress={() => setPreviewVisible(false)}
              danger
            />
            <ActionButton
              label="Use"
              onPress={uploadProfileImage}
              loading={uploading}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Section({ title, children }: any) {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: theme.colors.textSecondary,
          marginBottom: 10,
        }}
      >
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  danger,
  loading,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
  loading?: boolean;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor: danger
          ? theme.colors.surface
          : theme.colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: theme.radius.md,
        marginVertical: 6,
      }}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.background} />
      ) : (
        <Text
          style={{
            color: danger
              ? theme.colors.alert
              : theme.colors.background,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
