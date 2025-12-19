import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import api from '@/contexts/axios.instance';
import { useAuth } from '@/contexts/AuthContext';
import { uploadImageToBucket } from '@/services/fileUpload';
import { getFaceEmbeddingFromImage } from '@/services/faceEmbedding';

interface Embedding {
  id: number;
  created_at: string;
  model_version: string;
  vector_length: number;
  image_url?: string;
  embedding?: number[];
  similarity_score?: number;
}

export default function FaceScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [embeddings, setEmbeddings] = useState<Embedding[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matrix, setMatrix] = useState<number[][]>([]);

  useEffect(() => {
    if (!user) return;
    fetchFaceData();
  }, [user]);

  const fetchFaceData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [embeddingsRes, profileRes] = await Promise.all([
        api.get(`/face/user/${user.id}`),
        api.get(`/profiles/${user.id}`),
      ]);
      // console.log("Embedding", embeddingsRes.data);

      setEmbeddings(embeddingsRes.data.embeddings || []);
      setProfileImage(profileRes.data.user_profile_picture || null);

      // Calculate similarity scores between embeddings
      calculateSimilarityScores(embeddingsRes.data.embeddings || []);
    } catch (err: any) {
      console.log('Error fetching data:', err);
      Alert.alert('Error', 'Failed to load face data');
    } finally {
      setLoading(false);
    }
  };
  async function fetchEmbeddingVector(id: number): Promise<number[]> {
    const res = await api.get(`/face/embedding/${id}`);

    if (!res.data?.embedding || res.data.embedding.length !== 512) {
      throw new Error('Invalid embedding data');
    }

    return res.data.embedding;
  }

  function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vector length mismatch');
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setModalVisible(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const calculateSimilarityScores = async (embeds: Embedding[]) => {
    try {
      if (embeds.length === 0) return;

      // 1️⃣ Fetch all vectors in parallel
      const vectors = await Promise.all(
        embeds.map(e => fetchEmbeddingVector(e.id))
      );

      // 2️⃣ Use the most recent embedding as reference
      const reference = vectors[0];

      // 3️⃣ Compute cosine similarity
      const updatedEmbeds = embeds.map((embed, index) => {
        const score =
          index === 0
            ? 1
            : cosineSimilarity(reference, vectors[index]);

        return {
          ...embed,
          similarity_score: Math.max(0, score) * 100, // percentage
        };
      });

      setEmbeddings(updatedEmbeds);
    } catch (err) {
      console.error('Similarity calculation failed:', err);
    }
  };

  const captureProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setModalVisible(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  const uploadProfileImage = async () => {
    if (!selectedImage || !user) return;

    setUploading(true);
    try {
      // 1️⃣ Upload to Django file server
      const imageUrl = await uploadImageToBucket(
        selectedImage,
        `profile_${user.id}.jpg`
      );

      // 2️⃣ Save URL in profile (THIS MATCHES YOUR BACKEND)
      await api.put(`/profiles/${user.id}`, {
        user_profile_picture: imageUrl,
      });

      setProfileImage(imageUrl);
      setModalVisible(false);
      setSelectedImage(null);

      Alert.alert('Success', 'Profile picture updated!');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };


  const pickFaceImage = async () => {
    try {
      if (embeddings.length >= 5) {
        Alert.alert('Limit Reached', 'Maximum 5 face embeddings allowed');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadFaceEmbedding(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick face image');
    }
  };



  const captureFaceImage = async () => {
    try {
      if (embeddings.length >= 5) {
        Alert.alert('Limit Reached', 'Maximum 5 face embeddings allowed');
        return;
      }

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed');
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
    } catch (error) {
      Alert.alert('Error', 'Failed to capture face image');
    }
  };


  const uploadFaceEmbedding = async (imageUri: string) => {
    if (!user) return;

    setUploading(true);
    try {
      // 1️⃣ Get 512D embedding from FACE SERVER
      const embedding = await getFaceEmbeddingFromImage(imageUri);

      // 2️⃣ Upload embedding to YOUR MAIN BACKEND
      await api.post(`/profiles/${user.id}/face-embeddings`, {
        embedding_vector: embedding,
        model_version: 'adaface-ir101',
      });

      // 3️⃣ Refresh UI
      await fetchFaceData();

      Alert.alert('Success', 'Face embedding added successfully!');
    } catch (error: any) {
      console.error('Face embedding error:', error);

      Alert.alert(
        'Error',
        error?.response?.data?.error ||
        error?.message ||
        'Failed to upload face embedding'
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteEmbedding = async (id: number) => {
    Alert.alert(
      'Delete Face',
      'Are you sure you want to delete this face embedding?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/face/embedding/${id}`);
              await fetchFaceData();
              Alert.alert('Success', 'Face embedding deleted');
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'Failed to delete embedding');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading face data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Face & Profile Picture</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="camera" size={22} color="#667eea" />
            <Text style={styles.sectionTitle}>Profile Picture</Text>
          </View>

          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require('@/assets/avatar.png')
                }
                style={styles.profileImage}
              />

              <TouchableOpacity
                style={styles.changeProfileButton}
                onPress={pickProfileImage}
              >
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.profileHelpText}>
              This is your public profile picture visible to health providers
            </Text>
          </View>
        </View>

        {/* Face Embeddings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={22} color="#667eea" />
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Face Recognition</Text>
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>
                  {embeddings.length}/5
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionDescription}>
            Add up to 5 face embeddings for secure authentication.
            Higher similarity scores indicate better face recognition.
          </Text>

          {/* Add Face Buttons */}
          {embeddings.length < 5 && (
            <View style={styles.addFaceButtons}>
              <TouchableOpacity
                style={styles.addFaceButton}
                onPress={captureFaceImage}
                disabled={uploading}
              >
                <LinearGradient
                  colors={['#4ECDC4', '#44A08D']}
                  style={styles.addFaceButtonGradient}
                >
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.addFaceButtonText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addFaceButton}
                onPress={pickFaceImage}
                disabled={uploading}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.addFaceButtonGradient}
                >
                  <Ionicons name="image" size={24} color="#fff" />
                  <Text style={styles.addFaceButtonText}>Choose Photo</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Face Embeddings List */}
          {embeddings.length > 0 ? (
            <View style={styles.embeddingsList}>
              {embeddings.map((embedding, index) => (
                <View key={embedding.id} style={styles.embeddingCard}>
                  <View style={styles.embeddingHeader}>
                    <View style={styles.embeddingIndex}>
                      <Text style={styles.embeddingIndexText}>Face {index + 1}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteEmbedding(embedding.id)}
                      style={styles.deleteButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.embeddingDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        {new Date(embedding.created_at).toLocaleDateString()}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="stats-chart" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        Similarity: {embedding.similarity_score?.toFixed(1)}%
                      </Text>
                      <View style={[
                        styles.similarityIndicator,
                        {
                          backgroundColor: embedding.similarity_score! > 80
                            ? '#4CAF50'
                            : embedding.similarity_score! > 65
                              ? '#FF9800'
                              : '#F44336'
                        }
                      ]} />
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="cube-outline" size={16} color="#666" />
                      <Text style={styles.detailText}>
                        Vector: {embedding.vector_length} dimensions
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="finger-print-outline" size={60} color="#ccc" />
              <Text style={styles.emptyStateText}>No face embeddings added yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add your first face for secure authentication
              </Text>
            </View>
          )}
        </View>

        {/* Security Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={22} color="#667eea" />
            <Text style={styles.sectionTitle}>Security Information</Text>
          </View>

          <View style={styles.securityInfo}>
            <View style={styles.securityItem}>
              <Ionicons name="lock-closed" size={20} color="#4CAF50" />
              <Text style={styles.securityText}>
                Face data is encrypted and stored securely
              </Text>
            </View>

            <View style={styles.securityItem}>
              <Ionicons name="warning" size={20} color="#FF9800" />
              <Text style={styles.securityText}>
                Minimum 2 face embeddings recommended for better accuracy
              </Text>
            </View>

            <View style={styles.securityItem}>
              <Ionicons name="information-circle" size={20} color="#2196F3" />
              <Text style={styles.securityText}>
                Similarity scores above 65% ensure reliable recognition
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Profile Picture Preview Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile Picture Preview</Text>

            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.modalImage}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedImage(null);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText} numberOfLines={1}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={uploadProfileImage}
                disabled={uploading}
                activeOpacity={0.7}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmButtonText} numberOfLines={1}>
                    Use
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },

  // Header
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    padding: 8,
    zIndex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 10,
  },

  // Sections
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },

  // Profile Picture
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#E8E8E8',
    backgroundColor: '#f0f0f0',
  },
  changeProfileButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#667eea',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHelpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: '80%',
  },

  // Counter Badge
  counterBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  counterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Add Face Buttons
  addFaceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addFaceButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  addFaceButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 15,
  },
  addFaceButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 5,
  },

  // Face Embeddings
  embeddingsList: {
    marginTop: 10,
  },
  embeddingCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  embeddingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  embeddingIndex: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  embeddingIndexText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  deleteButton: {
    padding: 6,
  },
  embeddingDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  similarityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    maxWidth: '80%',
  },

  // Security Info
  securityInfo: {
    gap: 12,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  securityText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 25,
    borderWidth: 4,
    borderColor: '#E8E8E8',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#4ECDC4',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});