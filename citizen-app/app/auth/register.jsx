import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name:"", email:"", password:"", phone:"" });
  const set = (key, value) => setForm(prev => ({...prev, [key]:value}));

  async function submit() {
    try {
      await register(form);
      Alert.alert("Account created", "You can now log in.");
      router.replace("/auth/login");
    } catch(e) {
      Alert.alert("Registration failed", e.response?.data?.message || "Try again.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Citizen Account</Text>
      {[
        ["name","Full name"],
        ["email","Email"],
        ["phone","Phone"],
        ["password","Password"]
      ].map(([key, placeholder]) => (
        <TextInput key={key} style={styles.input} placeholder={placeholder}
          placeholderTextColor="#789" value={form[key]}
          onChangeText={v=>set(key,v)} secureTextEntry={key==="password"} />
      ))}
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{flex:1,backgroundColor:"#071018",justifyContent:"center",padding:24},
  title:{fontSize:28,fontWeight:"800",color:"#fff",marginBottom:25},
  input:{backgroundColor:"#10202e",color:"#fff",padding:15,borderRadius:12,marginBottom:12},
  button:{backgroundColor:"#e63946",padding:16,borderRadius:12,alignItems:"center"},
  buttonText:{color:"#fff",fontWeight:"800"}
});
