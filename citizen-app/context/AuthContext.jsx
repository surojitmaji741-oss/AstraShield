import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("user").then(value => {
      if (value) setUser(JSON.parse(value));
      setLoading(false);
    });
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function register(form) {
    const { data } = await api.post("/auth/register", { ...form, role: "citizen" });
    return data;
  }

  async function logout() {
    await AsyncStorage.multiRemove(["token", "user"]);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
