import Feather from "@expo/vector-icons/Feather";
import { Icon } from "@react-native-material/core";
import { Tabs } from "expo-router";
import React from "react";

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={() => ({
        headerShown: false,
        tabBarActiveBackgroundColor: "#54634B",
        tabBarInactiveBackgroundColor: "#54634B",
        tabBarActiveTintColor: "#FCF9F5",
        tabBarInactiveTintColor: "#FCF9F525",
        tabBarStyle: {
          backgroundColor: "#54634B",
          borderTopWidth: 0,
        },
        tabBarIconStyle: {
          size: 24,
          marginTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tabs.Screen
        name="products"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Feather name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Icon name="cart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Icon name="account-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
