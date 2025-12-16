import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["x-auth-token"] = token;
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
