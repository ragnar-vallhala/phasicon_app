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
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryPicker, {
  Country,
} from 'react-native-country-picker-modal';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import api from '@/contexts/axios.instance';
import { useAuth } from '@/contexts/AuthContext';

export default function PersonalScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [countryCode, setCountryCode] = useState<Country['cca2']>('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [country, setCountry] = useState<Country | null>(null);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profiles/${user.id}`);
        const profileData = res.data;
        setProfile(profileData);
        setFormData({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          phone: profileData.phone || '',
          dob: profileData.dob || '',
          address_line1: profileData.address_line1 || '',
          state: profileData.state || '',
          pincode: profileData.pincode || '',
        });

        if (profileData.phone?.startsWith('+')) {
          const match = profileData.phone.match(/\+(\d+)/);
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

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    setSaving(true);
    try {
      const dataToSend = {
        ...formData,
        country: country?.name || profile?.country,
      };
      
      await api.put(`/profiles/${user?.id}`, dataToSend);
      
      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setEditing(false);
            setProfile(dataToSend);
          },
        },
      ]);
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
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading your information...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* ---------------- HEADER ---------------- */}
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
          
          <Text style={styles.headerTitle}>Personal Information</Text>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setEditing(!editing);
              setErrors({});
            }}
          >
            <Ionicons
              name={editing ? 'close-circle' : 'create-outline'}
              size={24}
              color="#fff"
            />
            <Text style={styles.editButtonText}>
              {editing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ---------------- BASIC INFO SECTION ---------------- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle-outline" size={22} color="#667eea" />
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            <Field
              label="First Name *"
              value={formData.first_name}
              editable={editing}
              error={errors.first_name}
              onChange={(v) => setFormData({ ...formData, first_name: v })}
            />

            <Field
              label="Last Name"
              value={formData.last_name}
              editable={editing}
              onChange={(v) => setFormData({ ...formData, last_name: v })}
            />
          </View>

          {/* ---------------- CONTACT INFO SECTION ---------------- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call-outline" size={22} color="#667eea" />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={[styles.label, errors.phone && styles.labelError]}>
                Phone Number *
              </Text>
              
              <View style={[
                styles.phoneRow,
                errors.phone && styles.inputError,
                !editing && styles.disabledInput
              ]}>
                <CountryPicker
                  countryCode={countryCode}
                  withFlag
                  withCallingCode
                  withFilter
                  withCountryNameButton
                  withFlagButton={false}
                  onSelect={(selectedCountry: Country) => {
                    setCountryCode(selectedCountry.cca2);
                    setCallingCode(selectedCountry.callingCode[0]);
                    setCountry(selectedCountry);
                    setFormData({
                      ...formData,
                      phone: `+${selectedCountry.callingCode[0]}${formData.phone?.replace(/^\+\d+/, '') || ''}`
                    });
                  }}
                  disabled={!editing}
                  containerButtonStyle={styles.countryPickerButton}
                />

                <Text style={styles.callingCode}>+{callingCode}</Text>

                <TextInput
                  value={formData.phone?.replace(`+${callingCode}`, '')}
                  editable={editing}
                  keyboardType="phone-pad"
                  placeholder="Enter phone number"
                  placeholderTextColor="#999"
                  onChangeText={(v) => {
                    setFormData({
                      ...formData,
                      phone: `+${callingCode}${v}`
                    });
                  }}
                  style={styles.phoneInput}
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>
          </View>

          {/* ---------------- PERSONAL DETAILS SECTION ---------------- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={22} color="#667eea" />
              <Text style={styles.sectionTitle}>Personal Details</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={styles.label}>Date of Birth</Text>
              
              <TouchableOpacity
                onPress={() => editing && setShowDOBPicker(true)}
                style={[
                  styles.dobButton,
                  !editing && styles.disabledInput
                ]}
                disabled={!editing}
              >
                <Ionicons name="calendar" size={20} color="#666" />
                <Text style={styles.dobText}>
                  {formData.dob
                    ? new Date(formData.dob).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Select your date of birth'}
                </Text>
                {editing && <Ionicons name="chevron-down" size={20} color="#666" />}
              </TouchableOpacity>

              {showDOBPicker && (
                <DateTimePicker
                  value={formData.dob ? new Date(formData.dob) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={(e, date) => {
                    setShowDOBPicker(false);
                    if (date) {
                      setFormData({
                        ...formData,
                        dob: date.toISOString().split('T')[0],
                      });
                    }
                  }}
                />
              )}
            </View>
          </View>

          {/* ---------------- ADDRESS SECTION ---------------- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={22} color="#667eea" />
              <Text style={styles.sectionTitle}>Address</Text>
            </View>

            <Field
              label="Address Line 1"
              value={formData.address_line1}
              editable={editing}
              multiline={true}
              numberOfLines={3}
              onChange={(v) => setFormData({ ...formData, address_line1: v })}
            />

            <Field
              label="State"
              value={formData.state}
              editable={editing}
              onChange={(v) => setFormData({ ...formData, state: v })}
            />

            <Field
              label="Pincode"
              value={formData.pincode}
              editable={editing}
              keyboardType="numeric"
              error={errors.pincode}
              maxLength={6}
              onChange={(v) => setFormData({ ...formData, pincode: v })}
            />
          </View>

          {/* ---------------- SAVE BUTTON ---------------- */}
          {editing && (
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={styles.saveButton}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#4ECDC4', '#44A08D']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color="#fff" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* ---------------- DISCLAIMER ---------------- */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={16} color="#999" />
            <Text style={styles.disclaimerText}>
              Your information is securely stored and used only for health services.
              Required fields are marked with *
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- FIELD COMPONENT ---------------- */
function Field({
  label,
  value,
  editable,
  keyboardType,
  multiline,
  numberOfLines,
  maxLength,
  error,
  onChange,
}: {
  label: string;
  value?: string;
  editable?: boolean;
  keyboardType?: any;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  error?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
      <TextInput
        value={value}
        editable={editable}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        onChangeText={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor="#999"
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.inputError,
          !editable && styles.disabledInput
        ]}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
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

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 36,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },

  // Sections
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 10,
  },

  // Form Elements
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  labelError: {
    color: '#FF6B6B',
  },
  
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  disabledInput: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E8E8E8',
  },
  
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  // Phone Input
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  countryPickerButton: {
    paddingVertical: 12,
  },
  callingCode: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },

  // DOB Button
  dobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  dobText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },

  // Save Button
  saveButton: {
    marginVertical: 10,
    padding: 18,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    marginBottom: 30,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    lineHeight: 18,
  },
});