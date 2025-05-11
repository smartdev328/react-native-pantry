import RoundedButton from "@/components/RoundedButton";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

function ExploreScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Meal Explorer!</Text>
      <RoundedButton title="Go to Back" onPress={() => router.back()} />
    </View>
  );
}

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 34,
    backgroundColor: "#FCF9F5",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 24, marginBottom: 40, fontFamily: "AGaramondPro-Bold" },
});
