import { searchMeals } from '@/api/meal.apis';
import MealCard from '@/components/MealCard';
import PageHeader from '@/components/PageHeader';
import TextInputWithIcon from '@/components/TextInputWithIcon';
import { Meal } from '@/types';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const MARGIN = 16;
const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - MARGIN * 3) / 2;

function SearchHeader({ query, setQuery }: { query: string; setQuery: (query: string) => void }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <PageHeader title="Search" />
      <TextInputWithIcon
        placeholder="Search meals..."
        value={query}
        color='#54634B'
        label="Search"
        onChangeText={setQuery}
        returnKeyType="search"
      />
    </View>
  )
}

function SearchScreen() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce input to avoid too many requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  const { data: results, isLoading } = useQuery<Meal[]>({
    queryKey: ['searchMeals', debouncedQuery],
    queryFn: () => searchMeals(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  });


  if (isLoading) {
    return (
      <SafeAreaView style={{ ...styles.container, paddingHorizontal: 16 }}>
        <SearchHeader query={query} setQuery={setQuery} />
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!isLoading && debouncedQuery.length === 0) {
    return (
      <SafeAreaView style={{ ...styles.container, paddingHorizontal: 16 }}>
        <SearchHeader query={query} setQuery={setQuery} />
        <View style={styles.messageContainer}>
          <Text style={styles.message}>Type something to search meals.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isLoading && debouncedQuery.length > 0 && results && results.length === 0) {
    return (
      <SafeAreaView style={{ ...styles.container, paddingHorizontal: 16 }}>
        <SearchHeader query={query} setQuery={setQuery} />
        <View style={styles.center}>
          <Text style={styles.message}>No meals found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.scrollContainer}
        ListHeaderComponent={() => (
          <SearchHeader query={query} setQuery={setQuery} />
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <MealCard meal={item} width={ITEM_WIDTH} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FCF9F5",
    paddingTop: 50,
  },
  loader: {
    marginTop: 20,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: ITEM_WIDTH,
    borderRadius: 8,
    overflow: "hidden",
  },
  scrollContainer: { padding: 16, paddingTop: 0, paddingBottom: 28 },
});
