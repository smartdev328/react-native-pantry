import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  textStyle?: object;
}

export default function RoundedButton({ title, onPress, style, textStyle }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#54634B',
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  text: {
    color: '#FCF9F5',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    fontFamily: 'Avenir-Regular',
  },
});
