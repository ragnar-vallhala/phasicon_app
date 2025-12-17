import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import api from '@/contexts/axios.instance';
import { useAuth } from '@/contexts/AuthContext';

export default function CompleteProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');

    if (!user) return null;

    const handleSubmit = async () => {
        if (!firstName || !phone) {
            Alert.alert('Error', 'First name and phone are required');
            return;
        }

        setLoading(true);
        try {
            await api.put(`/profiles/${user.id}`, {
                first_name: firstName,
                last_name: lastName,
                phone,
                dob,
                address_line1: address1,
                address_line2: address2,
                state,
                pincode,
            });

            Alert.alert('Success', 'Profile completed');
            router.replace('/(tabs)');
        } catch (err: any) {
            console.log('PROFILE UPDATE ERROR', {
                status: err.response?.status,
                data: err.response?.data,
                headers: err.response?.headers,
                user: user
            });
            Alert.alert(
                'Error',
                err.response?.data?.error || 'Failed to update profile'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Complete Profile',
                    headerBackVisible: false, // 🚫 no going back
                }}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, backgroundColor: '#fff' }}
            >
                <ScrollView
                    contentContainerStyle={{
                        padding: 20,
                        paddingBottom: 40,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 26,
                            fontWeight: '700',
                            marginBottom: 10,
                        }}
                    >
                        Complete your profile
                    </Text>

                    <Text style={{ color: '#666', marginBottom: 30 }}>
                        This information is required to continue
                    </Text>

                    <Input label="First Name *" value={firstName} onChange={setFirstName} />
                    <Input label="Last Name" value={lastName} onChange={setLastName} />
                    <Input
                        label="Phone *"
                        value={phone}
                        onChange={setPhone}
                        keyboardType="phone-pad"
                    />
                    <Input label="Date of Birth" value={dob} onChange={setDob} />
                    <Input label="Address Line 1" value={address1} onChange={setAddress1} />
                    <Input label="Address Line 2" value={address2} onChange={setAddress2} />
                    <Input label="State" value={state} onChange={setState} />
                    <Input
                        label="Pincode"
                        value={pincode}
                        onChange={setPincode}
                        keyboardType="numeric"
                    />

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? '#ccc' : '#007AFF',
                            padding: 16,
                            borderRadius: 10,
                            alignItems: 'center',
                            marginTop: 20,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                                Save & Continue
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

/* ------------------ Reusable Input ------------------ */

function Input({
    label,
    value,
    onChange,
    keyboardType,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    keyboardType?: any;
}) {
    return (
        <View style={{ marginBottom: 14 }}>
            <Text style={{ marginBottom: 6, fontWeight: '500' }}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChange}
                keyboardType={keyboardType}
                style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                }}
            />
        </View>
    );
}
