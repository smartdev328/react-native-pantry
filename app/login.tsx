import RoundedButton from "@/components/RoundedButton";
import TextInputWithIcon from "@/components/TextInputWithIcon";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

interface LoginValues {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function getFirebaseErrorMessage(errorCode: string) {
  switch (errorCode) {
    case "auth/user-not-found":
      return "User not found. Please check your email.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    default:
      return "An unknown error occurred.";
  }
}

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (values: LoginValues, { setSubmitting, setErrors }: FormikHelpers<LoginValues>) => {
    try {
      await login(values.email, values.password);
      router.replace("/(tabs)/products");
    } catch (e: unknown) {
      const errorCode = (e as { code?: string }).code || "";
      const friendlyMsg = getFirebaseErrorMessage(errorCode);
      setErrors({ password: friendlyMsg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerBold}>Pantry by Marble</Text>
      </View>
      <View style={styles.divider}></View>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
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
                title="Login"
                onPress={() => handleSubmit()}
                disabled={isSubmitting || !isValid}
              />
            </View>
            <View style={styles.authLinkBtnContainer}>
              <Text style={styles.authLinkText}>Don&apos;t have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={styles.authLinkBtn}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
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
  formContainer: { marginTop: 82 },
  authLinkBtnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 24,
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
  formField: {
    marginBottom: 32,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Avenir-Regular",
  },
});
