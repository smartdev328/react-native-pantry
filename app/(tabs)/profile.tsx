import PageHeader from "@/components/PageHeader";
import RoundedButton from "@/components/RoundedButton";
import { db } from "@/config/firebase.config";
import { useAuth } from "@/context/auth.context";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

function ProfileScreen() {
  const { user, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      (async () => {
        try {
          const ref = doc(db, "users", user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            const ts = data.createdAt;
            setProfile({
              name: data.name || user.displayName || "",
              email: data.email || user.email || "",
              phone: data.phone || (user.phoneNumber ?? ""),
              createdAt: ts?.toDate?.().toLocaleString() || "",
            });
          }
        } catch (err) {
          console.error("Error loading profile:", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [authLoading, user]);

  if (authLoading || loading) {
    return (
      <SafeAreaView style={{ ...styles.container, paddingHorizontal: 16 }}>
        <PageHeader title="Profile" />
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={{ ...styles.container, paddingHorizontal: 16 }}>
        <PageHeader title="Profile" />
        <View style={styles.center}>
          <Text style={styles.message}>No profile data available.</Text>
          <RoundedButton title="Log out" onPress={logout} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title="Profile" />
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{profile.name}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{profile.email}</Text>

      <Text style={styles.label}>Phone:</Text>
      <Text style={styles.value}>{profile.phone}</Text>

      <Text style={styles.label}>Joined:</Text>
      <Text style={styles.value}>{profile.createdAt}</Text>
    </SafeAreaView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF9F5",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 14, color: "#666" },
  value: { fontSize: 16, color: "#000", marginTop: 4, marginBottom: 24 },
  message: { fontSize: 16, color: "#666", textAlign: "center", marginTop: 20 },
});
