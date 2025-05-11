import RoundedButton from "@/components/RoundedButton";
import TextInputWithIcon from "@/components/TextInputWithIcon";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/(tabs)/products");
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerBold}>Pantry by Marble</Text>
      </View>
      <View style={styles.divider}></View>
      <View style={styles.formContainer}>
        <TextInputWithIcon
          label="Email"
          color="#54634B"
          type="emailAddress"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInputWithIcon
          label="Password"
          type="password"
          color="#54634B"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />
        <View style={{ marginTop: 16 }}>
          <RoundedButton title="Login" onPress={handleLogin} />
        </View>
        <View style={styles.authLinkBtnContainer}>
          <Text style={styles.authLinkText}>Don&apos;t have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.authLinkBtn}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#FCF9F5",
  },
  titleContainer: { alignItems: "center" },
  headerBold: {
    width: "100%",
    textAlign: "center",
    fontSize: 45,
    lineHeight: 50,
    fontFamily: "AGaramondPro-BoldItalic",
    color: "#54634B",
  },
  divider: {
    height: 15,
    width: "100%",
    backgroundColor: "#54634B",
    marginTop: 16,
  },
  formContainer: { marginTop: 82, gap: 32 },
  authLinkBtnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  authLinkBtn: {
    fontFamily: "Avenir-Black",
    color: "#54634B",
    fontSize: 14,
    lineHeight: 20,
  },
  authLinkText: {
    fontFamily: "Avenir-Regular",
    color: "#54634B",
    fontSize: 14,
    lineHeight: 20,
  },
});
