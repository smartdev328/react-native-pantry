import { useCart } from "@/context/cart.context";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function CartItem({
  id,
  name,
  price,
  image,
}: {
  id: string;
  name: string;
  price: number;
  image: string;
}) {
  const { removeFromCart, updateQuantity, cartItems } = useCart();
  const quantity = cartItems.find((item) => item.id === id)?.quantity || 0;

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.thumb} />
      <View style={styles.details}>
        <Text style={styles.name}>{name.toUpperCase()}</Text>
        <Text style={styles.price}>R{price.toFixed(2)}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => removeFromCart(id)}
            style={styles.removeBtn}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>

          <View style={styles.counter}>
            <TouchableOpacity
              onPress={() => updateQuantity(id, quantity - 1)}
              disabled={quantity <= 1}
              style={styles.counterBtn}
            >
              <Text style={styles.counterText}>–</Text>
            </TouchableOpacity>

            <Text style={styles.qtyText}>{quantity}</Text>

            <TouchableOpacity
              onPress={() => updateQuantity(id, quantity + 1)}
              style={styles.counterBtn}
            >
              <Text style={styles.counterText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#54634B",
    paddingVertical: 16,
    alignItems: "center",
  },
  thumb: {
    width: 126,
    height: 126,
  },
  details: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 24,
  },
  name: {
    fontSize: 14,
    lineHeight: 18,
    color: "#54634B",
    fontFamily: "AGaramondPro-Italic",
  },
  price: {
    fontSize: 14,
    lineHeight: 18,
    color: "#54634B",
    fontFamily: "AGaramondPro-BoldItalic",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  removeBtn: {
    borderWidth: 2,
    borderColor: "#54634B",
    borderStyle: "solid",
    borderRadius: 20,
    height: 30,
    width: 84,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    fontSize: 12,
    lineHeight: 20,
    color: "#54634B",
    fontFamily: "Avenir-Regular",
  },
  counter: {
    flexDirection: "row",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "space-between",
  },
  counterBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#54634B",
    borderWidth: 2,
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#54634B",
  },
  qtyText: {
    fontSize: 14,
    lineHeight: 20,
    width: 20,
    textAlign: "center",
    color: "#54634B",
    fontFamily: "Geogeomanist-Medium",
  },
});
