import { fetchMealById } from "@/api/meal.apis";
import MealCard from "@/components/MealCard";
import PageHeader from "@/components/PageHeader";
import { useFavorites } from "@/context/favorites.context";
import { Meal } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const MARGIN = 16;
const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - MARGIN * 3) / 2;

function FavoritesScreen() {
  const { favorites } = useFavorites();
  const favoriteIds = Object.keys(favorites);

  const { data: meals, isLoading } = useQuery<Meal[]>({
    queryKey: ["favMeals", favoriteIds],
    queryFn: async () => {
      const results = await Promise.all(
        favoriteIds.map((id) => fetchMealById(id))
      );
      return results;
    },
    enabled: Array.isArray(favoriteIds) && favoriteIds.length > 0,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={{ ...styles.container, paddingHorizontal: 16 }}>
        <PageHeader title="Favorites" />
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!favorites || favoriteIds.length === 0) {
    return (
      <SafeAreaView style={{ ...styles.container, paddingHorizontal: 16 }}>
        <PageHeader title="Favorites" />
        <View style={styles.center}>
          <Text style={styles.message}>No favorites yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={() => <PageHeader title="Favorites" />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <MealCard meal={item} width={ITEM_WIDTH} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF9F5",
    paddingTop: 50,
  },
  scrollContainer: { padding: 16, paddingTop: 0, paddingBottom: 28 },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: ITEM_WIDTH,
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  authLinkText: {
    fontFamily: "Avenir-Regular",
    color: "#54634B",
    fontSize: 14,
    lineHeight: 20,
  },
  subtitleText: {
    fontSize: 30,
    lineHeight: 40,
    fontFamily: "AGaramondPro-Bold",
    color: "#54634B",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  preheadText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Avenir-Regular",
    color: "#54634B",
    marginBottom: 4,
  },
  loader: { marginVertical: 24 },
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
});
