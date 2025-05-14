import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth.context';

type FavoritesState = { [mealId: string]: boolean };

interface FavoritesContextType {
  favorites: FavoritesState;
  toggleFavorite: (mealId: string) => void;
  isFavorite: (mealId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoritesState>({});
  const { user } = useAuth();

  // Load favorites from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(`favorites_${user?.uid}`).then(data => {
      if (data) {
        setFavorites(JSON.parse(data));
      }
    });
  }, [user?.uid]);

  const toggleFavorite = async (mealId: string) => {
    setFavorites(prev => {
      const newFavs = { ...prev };
      if (newFavs[mealId]) {
        delete newFavs[mealId];   // un-favorite
      } else {
        newFavs[mealId] = true;   // mark as favorite
      }
      return newFavs;
    });
    // Optimistically update UI immediately, then persist in background
    try {
      await AsyncStorage.setItem(`favorites_${user?.uid}`, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  };

  const isFavorite = (mealId: string) => !!favorites[mealId];

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook to use the Favorites context
export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};
