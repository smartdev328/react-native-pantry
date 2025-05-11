import { Meal } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MEALS_API_URL = "https://dummyjson.com/recipes";
const MEALS_CACHE_KEY = "meals";
const TOTAL_CACHE_KEY = "total_pages";

// Fetch meals from API
export async function fetchMealsPage(
  offset: number = 0,
  limit: number = 10
): Promise<{ data: Meal[]; total: number }> {
  try {
    const res = await fetch(`${MEALS_API_URL}?limit=${limit}&skip=${offset}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    const meals: Meal[] = (json.recipes || []).map((m: any, i: number) => ({
      id: m.id,
      name: m.name,
      thumbnail: m.image,
      category: m.tags,
      price: m.id * 10,
    }));

    return { data: meals, total: json.total as number };
  } catch (err) {
    console.warn("Fetch failed, falling back to cache:", err);
    const { data, totalPages } = await loadMealsFromCache(offset, limit);
    return { data: data || [], total: totalPages };
  }
}

export async function fetchMealById(id: string): Promise<Meal> {
  try {
    const res = await fetch(`${MEALS_API_URL}/${id}`);
    const json = await res.json();
    const meal: Meal = {
      id: json.id,
      name: json.name,
      thumbnail: json.image,
      category: json.tags,
      price: json.id * 10,
    };
    const cacheKey = `meal_${id}`;
    await AsyncStorage.setItem(cacheKey, JSON.stringify(meal));
    return meal;
  } catch (e) {
    // Fallback to local cache if offline or fetch failed
    const cacheKey = `meal_${id}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached) as Meal;
    }
    throw e;
  }
}

export async function searchMeals(query: string): Promise<Meal[]> {
  if (!query) return [];

  try {
    const res = await fetch(`${MEALS_API_URL}/search?q=${query}`);
    const json = await res.json();

    const meals: Meal[] = (json.recipes || []).map((m: any, i: number) => ({
      id: m.id,
      name: m.name,
      thumbnail: m.image,
      category: m.tags,
      price: m.id * 10,
    }));

    return meals;
  } catch (err) {
    // If offline or request fails, return an empty array
    console.warn("searchMeals failed, returning empty array", err);
    return [];
  }
}

// Load meals from local cache (if present)
export async function loadMealsFromCache(
  offset: number,
  limit: number
): Promise<{ data: Meal[] | null; totalPages: number }> {
  const all: Meal[] = JSON.parse(
    (await AsyncStorage.getItem(MEALS_CACHE_KEY)) || "[]"
  );
  const totalPages = (await AsyncStorage.getItem(TOTAL_CACHE_KEY)) || "0";
  return {
    data: all.slice(offset, offset + limit),
    totalPages: parseInt(totalPages),
  };
}

export async function appendMealsToCache(
  newMeals: Meal[],
  offset: number,
  totalPages: number
) {
  await AsyncStorage.setItem(TOTAL_CACHE_KEY, totalPages.toString());
  if (offset === 0) {
    await AsyncStorage.setItem(MEALS_CACHE_KEY, JSON.stringify(newMeals));
  } else {
    const raw = await AsyncStorage.getItem(MEALS_CACHE_KEY);
    const existing: Meal[] = raw ? JSON.parse(raw) : [];
    const merged = [...existing, ...newMeals];
    await AsyncStorage.setItem(MEALS_CACHE_KEY, JSON.stringify(merged));
  }
}
