import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native'
import RoundedButton from './RoundedButton'

type OrderSummaryProps = {
  subtotal: number
  delivery: number
  onCheckout: () => void
  style?: ViewStyle
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  delivery,
  onCheckout,
  style,
}) => {
  const total = subtotal + delivery

  const format = (amount: number) =>
    `R ${amount.toFixed(2)}`

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <Text style={styles.label}>Sub total</Text>
        <Text style={styles.value}>{format(subtotal)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Delivery</Text>
        <Text style={styles.value}>{format(delivery)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{format(total)}</Text>
      </View>

      <RoundedButton 
        title="Checkout"
        onPress={onCheckout}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBEAE4',
    paddingHorizontal: 16,
    paddingVertical: 40,
    marginHorizontal: -16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Avenir-Regular',
    color: '#54634B',
  },  
  value: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Avenir-Black',
    color: '#54634B',
  },
  divider: {
    height: 1,
    backgroundColor: '#54634B',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'AGaramondPro-Bold',
    color: '#54634B',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'AGaramondPro-Bold',
    color: '#54634B',
  },
})
