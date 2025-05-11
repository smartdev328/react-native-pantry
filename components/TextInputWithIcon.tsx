import { Icon, TextInput, TextInputProps } from '@react-native-material/core';
import React, { useState } from 'react';
import { KeyboardTypeOptions, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'none' | 'emailAddress' | 'password' | 'phone';
  placeholder?: string;
}

export default function TextInputWithIcon({
  label,
  value,
  onChangeText,
  type = 'none',
  placeholder,
  color,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // set keyboard and secureTextEntry based on type
  let keyboardType: KeyboardTypeOptions = 'default';
  let secureTextEntry = false;
  if (type === 'emailAddress') keyboardType = 'email-address';
  if (type === 'phone') keyboardType = 'phone-pad';
  if (type === 'password') secureTextEntry = !showPassword;

  // decide which icon to show at the end
  const renderTrailing = () => {
    if (type === 'password') {
      return (
        <Icon
          name={showPassword ? 'eye-outline' : 'eye-off-outline'}
          size={24}
          color={color}
          onPress={() => setShowPassword(v => !v)}
        />
      );
    }
    if (value) {
      return (
        <Icon
          name="close"
          size={24}
          color={color}
          onPress={() => onChangeText('')}
        />
      );
    }
    return null;
  };

  return (
    <TextInput
      variant="standard"
      label={label}
      placeholder={placeholder}
      placeholderTextColor="#54634B"
      style={styles.container}
      inputStyle={styles.input}
      color="#54634B"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      trailing={renderTrailing}
      trailingContainerStyle={styles.trailing}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    color: '#54634B',
    tintColor: '#54634B',
    overlayColor: '#54634B',
    backgroundColor: '#FCF9F5',
  },
  input: {
    fontFamily: 'AGaramondPro-Bold',
    color: '#54634B',
    fontSize: 18,
    lineHeight: 24,
    paddingTop: 16,
    opacity: 1,
  },
  trailing: {
    marginRight: 8,
  },
});
