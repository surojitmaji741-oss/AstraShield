import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    try {
      const data = await login(email.trim(), password);
      if (data.user.role !== "citizen") {
        Alert.alert("Wrong account", "Use the Rescue app or Admin dashboard for this account.");
        return;
      }
      router.replace("/citizen/home");
    } catch (e) {
      Alert.alert("Login failed", e.response?.data?.message || "Cannot connect to backend.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🛡️</Text>
      <Text style={styles.title}>SentinelMesh</Text>
      <Text style={styles.subtitle}>Citizen Safety Network</Text>

      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#789"
        value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#789"
        value={password} onChangeText={setPassword} secureTextEntry />

      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/auth/register")}>
        <Text style={styles.link}>Create citizen account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:"#071018",justifyContent:"center",padding:24},
  logo:{fontSize:60,textAlign:"center"},
  title:{fontSize:32,fontWeight:"800",color:"#fff",textAlign:"center"},
  subtitle:{color:"#8fa4b7",textAlign:"center",marginBottom:30},
  input:{backgroundColor:"#10202e",color:"#fff",padding:15,borderRadius:12,marginBottom:14},
  button:{backgroundColor:"#e63946",padding:16,borderRadius:12,alignItems:"center"},
  buttonText:{color:"#fff",fontWeight:"800"},
  link:{color:"#4dabf7",textAlign:"center",marginTop:22}
});
