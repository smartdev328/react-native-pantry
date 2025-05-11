import { Meal } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MEALS_API_URL = "https://api.spoonacular.com/recipes";
const API_KEY = "b257caf8778c468d87e056795ad7dc29";
const MEALS_CACHE_KEY = "meals";

export async function fetchMealById(id: string): Promise<Meal> {
  try {
    const res = await fetch(`${MEALS_API_URL}/${id}/information?apiKey=${API_KEY}`);
    const json = await res.json();
    const meal: Meal = {
      id: json.id,
      name: json.title,
      thumbnail: json.image,
      price: json.id / 100,
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
    const res = await fetch(`${MEALS_API_URL}/complexSearch?apiKey=${API_KEY}&query=${query}`);
    const json = await res.json();

    const meals: Meal[] = (json.results || []).map((m: any, i: number) => ({
      id: m.id,
      name: m.title,
      thumbnail: m.image,
      price: m.id / 100,
    }));

    return meals;
  } catch (err) {
    // If offline or request fails, return an empty array
    console.warn("searchMeals failed, returning empty array", err);
    return [];
  }
}

export async function fetchMealsByCategories(categories: string[], offset: number,
  limit: number): Promise<{ data: Meal[]; total: number }> {
  const cacheKey = `${MEALS_CACHE_KEY}_${categories.join(',')}`;
  try {
    // fire off all category requests in parallel
    let query = `apiKey=${API_KEY}&offset=${offset}&number=${limit}`;
    if (!categories.includes("All")) {
      query += `&includeIngredients=${categories.join(',')}`;
    }
    const res = await fetch(`${MEALS_API_URL}/complexSearch?${query}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch category ${categories.join(',')}: ${res.status}`);
    }
    const json = await res.json();
    const meals: Meal[] = (json.results || []).map((m: any) => ({
      id: m.id,
      name: m.title,
      thumbnail: m.image,
      price: m.id / 100,
    }));
    await appendMealsToCache(cacheKey, meals, offset, json.totalResults);

    return { data: meals, total: json.totalResults };
  } catch (error) {
    console.warn(
      "fetchMealsByCategory: network error, falling back to cache",
      error
    );
    const { data, totalPages } = await loadMealsFromCache(cacheKey, offset, limit);
    return { data: data || [], total: totalPages };
  }
}

export async function loadMealsFromCache(
  cacheKey: string,
  offset: number,
  limit: number,
): Promise<{ data: Meal[]; totalPages: number }> {
  const totalKey = `${cacheKey}_total`;
  const cached = await AsyncStorage.getItem(cacheKey) ?? "[]";
  const totalCount = await AsyncStorage.getItem(totalKey) ?? "0";
  if (cached) {
    const meals: Meal[] = JSON.parse(cached);
    return {
      data: meals.slice(offset, offset + limit),
      totalPages: parseInt(totalCount),
    };
  }
  return { data: [], totalPages: 0 };
}

export async function appendMealsToCache(
  cacheKey: string,
  newMeals: Meal[],
  offset: number,
  totalPages: number
) {
  await AsyncStorage.setItem(`${cacheKey}_total`, totalPages ? totalPages.toString() : "0");
  if (offset === 0) {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(newMeals));
  } else {
    const raw = await AsyncStorage.getItem(cacheKey);
    const existing: Meal[] = raw ? JSON.parse(raw) : [];
    const merged = [...existing, ...newMeals];
    await AsyncStorage.setItem(cacheKey, JSON.stringify(merged));
  }
}
