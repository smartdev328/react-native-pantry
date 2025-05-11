import { useAuth } from "@/context/auth.context";
import NetInfo from "@react-native-community/netinfo";
import { focusManager, onlineManager } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // Listen for network changes too (optional, kept from before)
  useEffect(() => {
    const unsubNet = NetInfo.addEventListener((state) => {
      onlineManager.setOnline(!!state.isConnected);
    });
    focusManager.setEventListener((fn) => {
      const sub = NetInfo.addEventListener(() => fn());
      return () => sub();
    });
    return () => unsubNet();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else {
        router.replace("/(tabs)/products");
      }
      setReady(true);
    }
  }, [user, loading, router]);

  // While we’re waiting for auth → show a splash/loading
  if (loading || !ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FCF9F5",
        }}
      >
        <ActivityIndicator size="large" color="#54634B" />
      </View>
    );
  }

  return null;
}
