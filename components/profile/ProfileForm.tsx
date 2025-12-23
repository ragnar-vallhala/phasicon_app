import React, { useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import ThemedInput from '@/components/common/ThemedInput';
import { useTheme } from '@/theme/ThemeProvider';

export default function ProfileForm({
  form,
  setForm,
}: {
  form: any;
  setForm: (v: any) => void;
}) {
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const update = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  return (
    <View>
      <ThemedInput
        label="First Name *"
        value={form.firstName}
        onChange={v => update('firstName', v)}
        placeholder="John"
      />

      <ThemedInput
        label="Last Name"
        value={form.lastName}
        onChange={v => update('lastName', v)}
        placeholder="Doe"
      />

      {/* -------- Phone -------- */}
      <ThemedInput
        label="Phone *"
        value={form.phone}
        onChange={v => update('phone', v)}
        keyboardType="phone-pad"
        placeholder="+91 9876543210"
      />

      {/* -------- DOB -------- */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <ThemedInput
          label="Date of Birth"
          value={form.dob}
          editable={false}
          placeholder="1990-01-01"
        />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={form.dob ? new Date(form.dob) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              update(
                'dob',
                selectedDate.toISOString().split('T')[0]
              );
            }
          }}
        />
      )}

      <ThemedInput
        label="Address Line 1"
        value={form.address1}
        onChange={v => update('address1', v)}
        placeholder="XYZ Street, ABC Building"
      />

      <ThemedInput
        label="Address Line 2"
        value={form.address2}
        placeholder='Centeral Gate, Near Landmark'
        onChange={v => update('address2', v)}
      />

      <ThemedInput
        label="State"
        value={form.state}
        onChange={v => update('state', v)}
        placeholder="New Delhi"
      />

      <ThemedInput
        label="Pincode"
        value={form.pincode}
        keyboardType="numeric"
        onChange={v => update('pincode', v)}
        placeholder="110001"
      />
    </View>
  );
}
