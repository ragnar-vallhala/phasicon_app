import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import api from '@/contexts/axios.instance';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/theme/ThemeProvider';

export default function PersonalScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDOBPicker, setShowDOBPicker] = useState(false);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profiles/${user.id}`);
        const p = res.data;
        setForm({
          first_name: p.first_name || '',
          last_name: p.last_name || '',
          phone: p.phone || '',
          dob: p.dob || '',
          address_line1: p.address_line1 || '',
          state: p.state || '',
          pincode: p.pincode || '',
        });
      } catch {
        Alert.alert('Error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.first_name?.trim()) e.first_name = 'Required';
    if (!form.phone?.trim()) e.phone = 'Required';
    if (form.pincode && !/^\d{6}$/.test(form.pincode))
      e.pincode = 'Invalid pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- SAVE ---------------- */
  const save = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      await api.put(`/profiles/${user?.id}`, form);
      Alert.alert('Saved', 'Profile updated');
      setEditing(false);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

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
      {/* ---------- HEADER ---------- */}
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
          Personal Information
        </Text>

        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text
            style={{
              color: theme.colors.primary,
              fontWeight: '600',
            }}
          >
            {editing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
        }}
      >
        <Section title="Basic">
          <Field
            label="First Name *"
            value={form.first_name}
            editable={editing}
            error={errors.first_name}
            onChange={v => setForm({ ...form, first_name: v })}
          />
          <Field
            label="Last Name"
            value={form.last_name}
            editable={editing}
            onChange={v => setForm({ ...form, last_name: v })}
          />
        </Section>

        <Section title="Contact">
          <Field
            label="Phone *"
            value={form.phone}
            editable={editing}
            keyboardType="phone-pad"
            error={errors.phone}
            onChange={v => setForm({ ...form, phone: v })}
          />
        </Section>

        <Section title="Details">
          <TouchableOpacity
            disabled={!editing}
            onPress={() => setShowDOBPicker(true)}
          >
            <Field
              label="Date of Birth"
              value={form.dob}
              editable={false}
              placeholder="Select date"
            />
          </TouchableOpacity>

          {showDOBPicker && (
            <DateTimePicker
              value={form.dob ? new Date(form.dob) : new Date()}
              mode="date"
              maximumDate={new Date()}
              onChange={(_, d) => {
                setShowDOBPicker(false);
                if (d)
                  setForm({
                    ...form,
                    dob: d.toISOString().split('T')[0],
                  });
              }}
            />
          )}
        </Section>

        <Section title="Address">
          <Field
            label="Address"
            value={form.address_line1}
            editable={editing}
            multiline
            onChange={v => setForm({ ...form, address_line1: v })}
          />
          <Field
            label="State"
            value={form.state}
            editable={editing}
            onChange={v => setForm({ ...form, state: v })}
          />
          <Field
            label="Pincode"
            value={form.pincode}
            editable={editing}
            keyboardType="numeric"
            error={errors.pincode}
            onChange={v => setForm({ ...form, pincode: v })}
          />
        </Section>

        {editing && (
          <TouchableOpacity
            onPress={save}
            disabled={saving}
            style={{
              marginTop: theme.spacing.lg,
              backgroundColor: theme.colors.primary,
              paddingVertical: 16,
              borderRadius: theme.radius.md,
              alignItems: 'center',
            }}
          >
            {saving ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text
                style={{
                  color: theme.colors.background,
                  fontWeight: '600',
                }}
              >
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------- SMALL REUSABLES ---------- */

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

function Field(props: any) {
  const theme = useTheme();
  const { label, error } = props;

  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          fontSize: 13,
          color: error
            ? theme.colors.alert
            : theme.colors.textSecondary,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <TextInput
        {...props}
        style={{
          backgroundColor: theme.colors.background,
          borderWidth: 1,
          borderColor: error
            ? theme.colors.alert
            : theme.colors.card,
          borderRadius: theme.radius.sm,
          padding: 14,
          color: theme.colors.textPrimary,
        }}
        placeholderTextColor={theme.colors.textMuted}
      />
      {error && (
        <Text
          style={{
            color: theme.colors.alert,
            fontSize: 12,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
