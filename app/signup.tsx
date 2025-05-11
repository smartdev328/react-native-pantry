import RoundedButton from "@/components/RoundedButton";
import TextInputWithIcon from "@/components/TextInputWithIcon";
import { useAuth } from "@/context/auth.context";
import { Icon } from "@react-native-material/core";
import { useRouter } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";

interface SignUpValues {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  phone: Yup.string().required("Mobile number is required"),
  password: Yup.string().required("Password is required"),
});

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const router = useRouter();

  const onSubmit = async (
    values: SignUpValues,
    { setSubmitting, setErrors }: FormikHelpers<SignUpValues>
  ) => {
    try {
      await signUp(values.email, values.password, values.phone, values.name);
      router.replace("/(tabs)/products");
    } catch (err: unknown) {
      setErrors({ password: (err as Error).message });
    } finally {
      setSubmitting(false);
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
        <Formik<SignUpValues>
          initialValues={{ name: "", email: "", phone: "", password: "" }}
          validationSchema={SignUpSchema}
          onSubmit={onSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
            isValid,
          }) => (
            <View style={styles.formContainer}>
              <View style={styles.formField}>
                <TextInputWithIcon
                  label="Full name"
                  color="#54634B"
                  placeholder="Enter your full name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>
              <View style={styles.formField}>
                <TextInputWithIcon
                  label="Email"
                  color="#54634B"
                  type="emailAddress"
                  placeholder="Enter your email"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>
              <View style={styles.formField}>
                <TextInputWithIcon
                  label="Mobile number"
                  color="#54634B"
                  type="phone"
                  placeholder="Enter your mobile number"
                  value={values.phone}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                />
                {touched.phone && errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>
              <View style={styles.formField}>
                <TextInputWithIcon
                  label="Password"
                  type="password"
                  color="#54634B"
                  placeholder="Enter your password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <View style={{ marginTop: 16 }}>
                <RoundedButton
                  title="Sign up"
                  onPress={handleSubmit as () => void}
                  disabled={isSubmitting || !isValid}
                />
              </View>
            </View>
          )}
        </Formik>
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
  formContainer: { marginTop: 58 },
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
  formField: {
    marginBottom: 24,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Avenir-Regular",
  },
});
