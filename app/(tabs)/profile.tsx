import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '@/contexts/AuthContext';
import api from '@/contexts/axios.instance';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState<any>(null);

  /* ---------------- FETCH PROFILE ---------------- */

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profiles/${user.id}`);
        setProfile(res.data);
      } catch {
        Alert.alert('Error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  /* ---------------- IMAGE PICKER ---------------- */

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!res.canceled && res.assets[0].base64) {
      setProfile((prev: any) => ({
        ...prev,
        user_profile_picture: `data:image/jpeg;base64,${res.assets[0].base64}`,
      }));
    }
  };

  /* ---------------- SAVE PROFILE ---------------- */

  const handleSave = async () => {
    if (!profile.first_name || !profile.phone) {
      Alert.alert('Error', 'First name and phone are required');
      return;
    }

    setSaving(true);
    try {
      await api.put(`/profile/${user?.id}`, profile);
      Alert.alert('Success', 'Profile updated');
      setEditing(false);
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.error || 'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* ---------------- HEADER ---------------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={editing ? pickImage : undefined}>
          <Image
            source={
              profile?.user_profile_picture
                ? { uri: profile.user_profile_picture }
                : require('@/assets/avatar.png')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.email}>{profile?.first_name + " " + profile?.last_name}</Text>

        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={styles.editBtn}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- FORM ---------------- */}
      <View style={styles.card}>
        <Field
          label="First Name"
          value={profile.first_name}
          editable={editing}
          onChange={v => setProfile({ ...profile, first_name: v })}
        />

        <Field
          label="Last Name"
          value={profile.last_name}
          editable={editing}
          onChange={v => setProfile({ ...profile, last_name: v })}
        />

        <Field
          label="Phone"
          value={profile.phone}
          editable={editing}
          onChange={v => setProfile({ ...profile, phone: v })}
        />

        <Field
          label="DOB"
          value={profile.dob}
          editable={editing}
          onChange={v => setProfile({ ...profile, dob: v })}
        />

        <Field
          label="Address"
          value={profile.address_line1}
          editable={editing}
          onChange={v => setProfile({ ...profile, address_line1: v })}
        />

        <Field
          label="State"
          value={profile.state}
          editable={editing}
          onChange={v => setProfile({ ...profile, state: v })}
        />

        <Field
          label="Pincode"
          value={profile.pincode}
          editable={editing}
          onChange={v => setProfile({ ...profile, pincode: v })}
        />

        {editing && (
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={styles.saveBtn}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- FIELD ---------------- */

function Field({
  label,
  value,
  editable,
  onChange,
}: {
  label: string;
  value?: string;
  editable?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        editable={editable}
        onChangeText={onChange}
        style={[
          styles.input,
          !editable && { backgroundColor: '#f1f1f1' },
        ]}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#eee',
    marginBottom: 10,
  },

  email: { color: '#fff', marginBottom: 10 },

  editBtn: {
    color: '#fff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  card: {
    padding: 20,
    margin: 20,
    borderRadius: 15,
    backgroundColor: '#f8f8f8',
  },

  label: { color: '#666', marginBottom: 4 },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  saveBtn: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  logoutBtn: {
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  logoutText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
