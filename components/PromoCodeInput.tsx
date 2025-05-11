import React, { useState } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'

type PromoCodeInputProps = {
  onApply: (code: string) => void
  placeholder?: string
  style?: ViewStyle
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  onApply,
  placeholder = 'Add your promo code',
}) => {
  const [code, setCode] = useState('')

  const handleApply = () => {
    const trimmed = code.trim()
    if (trimmed) onApply(trimmed)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder={placeholder}
        placeholderTextColor="#54634B"
        returnKeyType="done"
        onSubmitEditing={handleApply}
      />

      <View style={styles.separator} />

      <TouchableOpacity onPress={handleApply} disabled={!code} style={styles.button}>
        <Text style={[styles.buttonText, { opacity: code ? 1 : 0.4 }]}>Apply</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#54634B',
    borderRadius: 25,
    paddingVertical: 10,
    height: 40,
    paddingHorizontal: 20,

    ...Platform.select({
      ios: {
        shadowColor: '#54634B33',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
        shadowColor: '#54634B33',
      },
    }),
  },
  input: {
    flex: 1,
    fontSize: 12,
    height: 20,
    paddingVertical: 0,
    fontFamily: 'Avenir-Regular',
    color: '#54634B',
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#54634B',
    marginHorizontal: 20,
  },
  button: {
    width: 46,
    alignItems: 'flex-end',
    marginTop: -1,
  },
  buttonText: {
    color: '#54634B',
    fontSize: 12,
    lineHeight: 20,
    fontFamily: 'Avenir-Black',
  },
})
