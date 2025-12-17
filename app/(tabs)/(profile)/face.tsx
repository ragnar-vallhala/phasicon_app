import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import api from '@/contexts/axios.instance';
import { useAuth } from '@/contexts/AuthContext';

export default function FaceScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [embeddings, setEmbeddings] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchEmbeddings = async () => {
      try {
        const res = await api.get(`/face/user/${user.id}`);
        setEmbeddings(res.data.embeddings || []);
      } catch (err: any) {
        console.log('ERROR FETCHING EMBEDDINGS:', err.response?.data || err);
        setError('Failed to fetch embeddings');
      } finally {
        setLoading(false);
      }
    };

    fetchEmbeddings();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (embeddings.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No embeddings found for this user.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={embeddings}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>Embedding ID: {item.id}</Text>
          <Text>Created At: {item.created_at}</Text>
          <Text>Model Version: {item.model_version || 'N/A'}</Text>
          <Text>Vector Length: {item.vector_length}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
});
