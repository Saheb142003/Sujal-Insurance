import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["x-auth-token"] = token;
      // Optionally fetch user details here if you had a /me endpoint
      // For now, we'll just assume the token is valid and user is logged in
      setLoading(false);
    } else {
      delete api.defaults.headers.common["x-auth-token"];
      setLoading(false);
    }
  }, [token]);

  const login = async (formData) => {
    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
