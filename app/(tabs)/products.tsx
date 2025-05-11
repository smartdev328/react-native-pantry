import { fetchMealsByCategories } from "@/api/meal.apis";
import CategorySelector from "@/components/CategorySelector";
import MealCard from "@/components/MealCard";
import { Icon } from "@react-native-material/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MARGIN = 16;
const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - MARGIN * 3) / 2;

function ProductsHeader({
  value,
  onCategoryChange,
}: {
  value: string[];
  onCategoryChange: (categories: string[]) => void;
}) {
  const router = useRouter();

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push("/login")}
        >
          <Icon name="chevron-left" size={20} color="#54634B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.authLinkText}>Filter</Text>
          <Icon name="tune" size={20} color="#54634B" />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.headerBold}>Meat</Text>
      </View>
      <View style={styles.divider}></View>
      <View style={{ marginTop: 30, marginBottom: 40 }}>
        <CategorySelector value={value} onChange={onCategoryChange} />
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.preheadText}>Based on your selection</Text>
        <Text style={styles.subtitleText}>Our products</Text>
      </View>
    </>
  );
}

export default function Products() {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(['All']);

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["getMeals", selectedCategories.join(",")],
    queryFn: async ({ pageParam = 0 }) => {
      const limit = pageParam === 0 ? 40 : 10;
      const offset = pageParam === 0 ? 0 : (pageParam - 1) * limit + 40;
      const { data: meals, total } = await fetchMealsByCategories(
        selectedCategories,
        offset,
        limit
      );
      const totalPages = Math.ceil((total - 40) / 10) + 1;

      return {
        meals,
        nextOffset: pageParam + 1,
        totalPages,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.totalPages > lastPage.nextOffset
        ? lastPage.nextOffset
        : undefined,
  });

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error loading products.</Text>
      </View>
    );
  }

  const allMeals = data?.pages.flatMap((p) => p.meals) || [];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={allMeals}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={() => (
          <ProductsHeader value={selectedCategories} onCategoryChange={setSelectedCategories} />
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <MealCard meal={item} width={ITEM_WIDTH} />
          </View>
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          (isLoading || isFetchingNextPage) ? (
            <ActivityIndicator style={styles.loader} size="large" color="#54634B" />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FCF9F5",
  },
  scrollContainer: { padding: 16, paddingTop: 50, paddingBottom: 28 },
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
  headerBold: {
    fontSize: 40,
    lineHeight: 50,
    fontFamily: "AGaramondPro-Bold",
    color: "#54634B",
  },
  divider: {
    height: 15,
    width: "100%",
    backgroundColor: "#54634B",
    marginTop: 10,
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
  loader: { marginVertical: 24, },
  center: { flex: 1, justifyContent: "center" },
  error: {
    textAlign: "center",
    marginTop: 32,
    color: "red",
    fontFamily: "Avenir-Regular",
  },
});
