import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing details",
        "Enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await login(email, password);

      if (result?.user?.role !== "rescue") {
        Alert.alert(
          "Wrong account",
          "This application is only for registered rescue personnel."
        );
        return;
      }

      router.replace("/rescue/dashboard");
    } catch (error) {
      Alert.alert(
        "Login failed",
        error?.response?.data?.message ||
          "Backend unavailable."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🚑</Text>

      <Text style={styles.title}>Rescue Command</Text>

      <Text style={styles.subtitle}>
        Rescuer Login
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#789"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#789"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        style={[
          styles.loginButton,
          loading && styles.disabled,
        ]}
        onPress={submit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>
            Login
          </Text>
        )}
      </Pressable>

      <View style={styles.registerRow}>
        <Text style={styles.muted}>
          New rescuer?
        </Text>

        <Pressable
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.registerText}>
            {" "}
            Register here
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071018",
    justifyContent: "center",
    padding: 24,
  },

  logo: {
    fontSize: 60,
    textAlign: "center",
  },

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
  },

  subtitle: {
    color: "#91a8ba",
    fontSize: 15,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 26,
  },

  input: {
    backgroundColor: "#10202e",
    color: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#19384d",
    fontSize: 16,
  },

  loginButton: {
    backgroundColor: "#168aad",
    padding: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },

  disabled: {
    opacity: 0.6,
  },

  loginText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  muted: {
    color: "#789",
  },

  registerText: {
    color: "#45b8e8",
    fontWeight: "900",
  },
});