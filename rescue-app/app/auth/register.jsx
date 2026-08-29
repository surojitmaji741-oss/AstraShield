import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { registerRescuer } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Missing details", "Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak password",
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password mismatch",
        "Password and confirm password must match."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await registerRescuer({
        name,
        email,
        phone,
        password,
        role: "rescue",
      });

      if (result?.user?.role !== "rescue") {
        Alert.alert(
          "Registration error",
          "The account was not created as a rescuer account."
        );
        return;
      }

      Alert.alert(
        "Registration successful",
        "Your rescuer account has been created.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/rescue/dashboard"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Registration failed",
        error?.response?.data?.message || "Unable to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>🚑</Text>

        <Text style={styles.title}>Rescuer Registration</Text>

        <Text style={styles.subtitle}>
          Create your SentinelMesh rescue account
        </Text>

        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#789"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#789"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          placeholderTextColor="#789"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Minimum 6 characters"
          placeholderTextColor="#789"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirm Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Repeat password"
          placeholderTextColor="#789"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, loading && styles.disabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Create Rescuer Account
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/auth/login")}
          disabled={loading}
        >
          <Text style={styles.backText}>
            Already registered? Back to Login
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071018",
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  logo: {
    fontSize: 58,
    textAlign: "center",
    marginBottom: 8,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    color: "#91a8ba",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 25,
  },

  label: {
    color: "#b7cad8",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#10202e",
    color: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#19384d",
    fontSize: 16,
  },

  button: {
    backgroundColor: "#168aad",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },

  disabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },

  backButton: {
    alignItems: "center",
    padding: 20,
  },

  backText: {
    color: "#45b8e8",
    fontWeight: "800",
  },
});