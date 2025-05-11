import { useCart } from "@/context/cart.context";
import { useFavorites } from "@/context/favorites.context";
import { Meal } from "@/types";
import { Icon } from "@react-native-material/core";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface Props {
  meal: Meal;
  width: number;
}
const MealCard: React.FC<Props> = ({ meal, width }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCart, addToCart, removeFromCart } = useCart();

  const scale = useSharedValue(1);

  const heartAnimatedStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: scale.value }] };
  });

  const onHeartPress = () => {
    scale.value = withSequence(
      withSpring(1.3, { stiffness: 300 }),
      withTiming(1, { duration: 200 })
    );
    toggleFavorite(meal.id);
  };

  const onCartPress = () => {
    if (isInCart(meal.id)) {
      removeFromCart(meal.id);
    } else {
      addToCart(meal.id);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.heartIconView}>
        <Animated.View style={heartAnimatedStyle}>
          <TouchableOpacity onPress={onHeartPress}>
            <Icon
              name="heart"
              size={20}
              color={isFavorite(meal.id) ? "red" : "gray"}
              style={{ marginRight: 8 }}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Image
        source={{ uri: meal.thumbnail }}
        style={{ ...styles.image, height: width, width }}
      />
      <Text style={styles.title}>{meal.name}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.price}>R {meal.price?.toFixed(2)}</Text>
        <TouchableOpacity
          style={[
            styles.cartBtn,
            { backgroundColor: isInCart(meal.id) ? "#54634B" : "transparent" },
          ]}
          onPress={onCartPress}
        >
          <Icon
            name={isInCart(meal.id) ? "cart" : "cart-outline"}
            size={12}
            color={isInCart(meal.id) ? "white" : "#54634B"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MealCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  image: {
    borderRadius: 8,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "Avenir-Regular",
    color: "#54634B",
    opacity: 0.6,
    height: 40,
  },
  price: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "Avenir-Black",
    color: "#54634B",
  },
  cartBtn: {
    borderRadius: 50,
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#54634B",
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
  },
  heartIconView: {
    position: "absolute",
    top: 5,
    right: 0,
    zIndex: 1,
  },
});
