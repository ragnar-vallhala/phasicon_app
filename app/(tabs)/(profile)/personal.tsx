import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryPicker, {
  Country,
} from 'react-native-country-picker-modal';

import api from '@/contexts/axios.instance';
import { useAuth } from '@/contexts/AuthContext';

export default function PersonalScreen() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState<any>(null);

  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [countryCode, setCountryCode] = useState<Country['cca2']>('IN');
  const [callingCode, setCallingCode] = useState('91');

  /* ---------------- FETCH PROFILE ---------------- */

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profiles/${user.id}`);
        setProfile(res.data);

        // extract country code from phone
        if (res.data.phone?.startsWith('+')) {
          const match = res.data.phone.match(/\+(\d+)/);
          if (match) setCallingCode(match[1]);
        }
      } catch {
        Alert.alert('Error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  /* ---------------- SAVE PROFILE ---------------- */

  const handleSave = async () => {
    if (!profile.first_name || !profile.phone) {
      Alert.alert('Error', 'First name and phone are required');
      return;
    }

    setSaving(true);
    try {
      await api.put(`/profiles/${user?.id}`, profile);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* ---------------- EDIT TOGGLE ---------------- */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditing(!editing)}
        >
          <Text style={styles.editText}>
            {editing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>

        {/* ---------------- FIRST NAME ---------------- */}
        <Field
          label="First Name"
          value={profile?.first_name}
          editable={editing}
          onChange={v => setProfile({ ...profile, first_name: v })}
        />

        {/* ---------------- LAST NAME ---------------- */}
        <Field
          label="Last Name"
          value={profile?.last_name}
          editable={editing}
          onChange={v => setProfile({ ...profile, last_name: v })}
        />

        {/* ---------------- PHONE ---------------- */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Phone Number</Text>

          <View style={styles.phoneRow}>
            <CountryPicker
              countryCode={countryCode}
              withFlag
              withCallingCode
              withFilter
              onSelect={(country: Country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
              disabled={!editing}
            />

            <Text style={styles.callingCode}>+{callingCode}</Text>

            <TextInput
              value={profile?.phone?.replace(`+${callingCode}`, '')}
              editable={editing}
              keyboardType="phone-pad"
              placeholder="Mobile number"
              onChangeText={v =>
                setProfile({
                  ...profile,
                  phone: `+${callingCode}${v}`,
                })
              }
              style={[
                styles.phoneInput,
                !editing && { backgroundColor: '#f2f2f2' },
              ]}
            />
          </View>
        </View>

        {/* ---------------- DOB ---------------- */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Date of Birth</Text>

          <TouchableOpacity
            onPress={() => editing && setShowDOBPicker(true)}
            style={[
              styles.input,
              { justifyContent: 'center' },
              !editing && { backgroundColor: '#f2f2f2' },
            ]}
          >
            <Text style={{ fontSize: 16 }}>
              {profile?.dob
                ? new Date(profile.dob).toDateString()
                : 'Select date'}
            </Text>
          </TouchableOpacity>

          {showDOBPicker && (
            <DateTimePicker
              value={profile?.dob ? new Date(profile.dob) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(e, date) => {
                setShowDOBPicker(false);
                if (date) {
                  setProfile({
                    ...profile,
                    dob: date.toISOString().split('T')[0],
                  });
                }
              }}
            />
          )}
        </View>

        {/* ---------------- ADDRESS ---------------- */}
        <Field
          label="Address"
          value={profile?.address_line1}
          editable={editing}
          onChange={v =>
            setProfile({ ...profile, address_line1: v })
          }
        />

        <Field
          label="State"
          value={profile?.state}
          editable={editing}
          onChange={v => setProfile({ ...profile, state: v })}
        />

        <Field
          label="Pincode"
          value={profile?.pincode}
          editable={editing}
          keyboardType="numeric"
          onChange={v => setProfile({ ...profile, pincode: v })}
        />

        {/* ---------------- SAVE ---------------- */}
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
    </ScrollView>
  );
}

/* ---------------- FIELD ---------------- */

function Field({
  label,
  value,
  editable,
  keyboardType,
  onChange,
}: {
  label: string;
  value?: string;
  editable?: boolean;
  keyboardType?: any;
  onChange?: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        editable={editable}
        keyboardType={keyboardType}
        onChangeText={onChange}
        style={[
          styles.input,
          !editable && { backgroundColor: '#f2f2f2' },
        ]}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#f8f8f8',
  },

  editBtn: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },

  editText: {
    color: '#007AFF',
    fontWeight: '600',
  },

  label: {
    color: '#666',
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },

  callingCode: {
    marginHorizontal: 6,
    fontSize: 16,
  },

  phoneInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },

  saveBtn: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
