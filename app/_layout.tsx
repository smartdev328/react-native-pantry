import { AuthProvider } from "@/context/auth.context";
import { CartProvider } from "@/context/cart.context";
import { FavoritesProvider } from "@/context/favorites.context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IconComponent,
  IconComponentProvider,
} from "@react-native-material/core";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
      refetchOnReconnect: true,
      staleTime: 1000 * 60 * 60,
    },
    mutations: {
      networkMode: "offlineFirst",
    },
  },
});
const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "AGaramondPro-Bold": require("@/assets/fonts/AGaramondPro-Bold.otf"),
    "AGaramondPro-BoldItalic": require("@/assets/fonts/AGaramondPro-BoldItalic.otf"),
    "AGaramondPro-Italic": require("@/assets/fonts/AGaramondPro-Italic.otf"),
    "Avenir-Black": require("@/assets/fonts/Avenir-Black.ttf"),
    "Avenir-Regular": require("@/assets/fonts/Avenir-Regular.ttf"),
    "Geogeomanist-Medium": require("@/assets/fonts/geomanist-medium-webfont.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            {/* @ts-ignore */}
            <IconComponentProvider
              IconComponent={MaterialCommunityIcons as IconComponent}
            >
              <Slot />
            </IconComponentProvider>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}
