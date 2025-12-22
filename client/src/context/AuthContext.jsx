import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      const storedToken = localStorage.getItem("token");
      const sessionStart = localStorage.getItem("sessionStart");
      const SESSION_DURATION = 20 * 60 * 1000; // 20 minutes

      if (storedToken && sessionStart) {
        const now = Date.now();
        if (now - parseInt(sessionStart) > SESSION_DURATION) {
          // Session expired
          logout();
        } else {
          // Session valid, update timestamp (sliding window)
          localStorage.setItem("sessionStart", now.toString());
          api.defaults.headers.common["x-auth-token"] = storedToken;
          setLoading(false);
        }
      } else if (storedToken && !sessionStart) {
        // Legacy token without timestamp, treat as new session or expire?
        // Let's expire to enforce the new rule, or start a new session.
        // User said "after logout there is 20min cache save", implying explicit login starts it.
        // If we just refreshed, we should probably keep it if it was valid.
        // But to be safe and strict:
        logout();
      } else {
        delete api.defaults.headers.common["x-auth-token"];
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (formData) => {
    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("sessionStart", Date.now().toString());
      setToken(res.data.token);
      api.defaults.headers.common["x-auth-token"] = res.data.token; // Set header immediately
      setError(null);
      return true; // Indicate success
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionStart");
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
