import { fetchMealById } from "@/api/meal.apis";
import { CartItem } from "@/components/CartItem";
import { OrderSummary } from "@/components/OrderSummary";
import PageHeader from "@/components/PageHeader";
import { PromoCodeInput } from "@/components/PromoCodeInput";
import { useCart } from "@/context/cart.context";
import { Meal } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function CartScreen() {
  const { cartItems } = useCart();
  const cartIds = cartItems.map((item) => item.id);

  const { data: meals, isLoading } = useQuery<Meal[]>({
    queryKey: ["cartMeals", cartIds],
    queryFn: async () => {
      const details = await Promise.all(cartIds.map((id) => fetchMealById(id)));
      return details;
    },
  });

  const applyPromo = (code: string) => {
    Alert.alert("Promo applied!", code);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ ...styles.container, paddingHorizontal: 16 }}>
        <PageHeader title="Cart" />
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!meals || meals.length === 0) {
    return (
      <SafeAreaView style={{ ...styles.container, paddingHorizontal: 16 }}>
        <PageHeader title="Cart" />
        <View style={styles.center}>
          <Text style={styles.message}>No items in cart.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const subtotal = meals.reduce((acc, meal) => {
    const item = cartItems.find((item) => item.id === meal.id);
    return acc + (item ? meal.price * item.quantity : 0);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <PageHeader title="Cart" />
          </View>
        )}
        ListFooterComponent={() => (
          <View>
            <View style={styles.promoContainer}>
              <PromoCodeInput onApply={applyPromo} />
            </View>
            <OrderSummary
              subtotal={subtotal}
              delivery={30}
              onCheckout={() => Alert.alert("Checkout pressed")}
            />
          </View>
        )}
        renderItem={({ item }) => (
          <CartItem
            id={item.id}
            name={item.name ?? ""}
            price={item.price ?? 0}
            image={item.thumbnail ?? ""}
          />
        )}
      />
    </SafeAreaView>
  );
}

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF9F5",
    paddingTop: 50,
  },
  scrollContainer: { padding: 16, paddingTop: 0, paddingBottom: 0 },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  header: {
    marginBottom: -16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontFamily: "Avenir-Regular",
    color: "#54634B",
    fontSize: 14,
    lineHeight: 20,
  },
  promoContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
});
