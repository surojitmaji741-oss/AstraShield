import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const savedUser = await AsyncStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log("Session restore error:", error);
    }
  }

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setUser(user);

    return response.data;
  }

  async function registerRescuer({
  name,
  email,
  phone,
  password,
}) {
  const response = await api.post(
    "/auth/register",
    {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      role: "rescue",
    }
  );

  const { token, user } = response.data;

  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem(
    "user",
    JSON.stringify(user)
  );

  setUser(user);

  return response.data;
}

  async function logout() {
    await AsyncStorage.multiRemove([
      "token",
      "user",
    ]);

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        registerRescuer,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}