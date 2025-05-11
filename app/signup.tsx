import RoundedButton from "@/components/RoundedButton";
import TextInputWithIcon from "@/components/TextInputWithIcon";
import { useAuth } from "@/context/auth.context";
import { Icon } from "@react-native-material/core";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async () => {
    try {
      await signUp(email, password, phone, name);
      router.replace("/(tabs)/products");
    } catch (e: unknown) {
      alert((e as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="chevron-left" size={20} color="#54634B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/explore")}>
            <Text style={styles.authLinkText}>Explore app</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.headerBold}>Welcome to</Text>
          <Text style={styles.headerBold}>Pantry by Marble</Text>
        </View>
        <View>
          <Text style={styles.subtitleText}>
            Sign up for easy payment, collection
          </Text>
          <Text style={styles.subtitleText}>and much more</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.formContainer}>
          <TextInputWithIcon
            label="Full name"
            color="#54634B"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
          <TextInputWithIcon
            label="Email"
            color="#54634B"
            type="emailAddress"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInputWithIcon
            label="Mobile number"
            color="#54634B"
            type="phone"
            placeholder="Enter your mobile number"
            value={phone}
            onChangeText={setPhone}
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
            <RoundedButton title="Sign up" onPress={handleSignUp} />
          </View>
        </View>
        <View style={styles.authLinkBtnContainer}>
          <Text style={styles.authLinkText}>Have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.authLinkBtn}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.orDivider}>
          <View style={styles.orDividerLine}></View>
          <Text style={styles.authLinkText}>or</Text>
          <View style={styles.orDividerLine}></View>
        </View>
        <View style={{ marginTop: 16 }}>
          <RoundedButton
            title="Explore our app"
            onPress={() => router.push("/explore")}
          />
        </View>
        <View style={styles.authLinkBtnContainer}>
          <Text style={styles.authLinkText}>
            By sigining up you agree to our
          </Text>
          <TouchableOpacity>
            <Text style={styles.authLinkBtn}>Terms, Data Policy,</Text>
          </TouchableOpacity>
          <Text style={styles.authLinkText}>and</Text>
          <TouchableOpacity>
            <Text style={styles.authLinkBtn}>Cookies Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 34, backgroundColor: "#FCF9F5" },
  scrollContainer: { padding: 16, paddingBottom: 28 },
  headerBold: {
    fontSize: 40,
    lineHeight: 50,
    fontFamily: "AGaramondPro-BoldItalic",
    color: "#54634B",
  },
  divider: {
    height: 15,
    width: "100%",
    backgroundColor: "#54634B",
    marginTop: 8,
  },
  formContainer: { marginTop: 58, gap: 24 },
  authLinkBtnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 24,
    flexWrap: "wrap",
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
  subtitleText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Avenir-Regular",
    color: "#54634B",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orDivider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginVertical: 24,
  },
  orDividerLine: { height: 1, flex: 1, backgroundColor: "#54634B" },
});
