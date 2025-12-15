import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const THEME = {
  primary: "#1E40AF",
  primaryDark: "#1E3A8A",
  primaryLight: "#3B82F6",
  accent: "#F59E0B",
  accentDark: "#D97706",
  success: "#10B981",
  bg: "#F8FAFC",
  bgSecondary: "#F1F5F9",
  card: "#FFFFFF",
  cardHover: "#FEFEFE",
  text: "#0F172A",
  textSecondary: "#475569",
  border: "#E2E8F0",
  shadow: "rgba(15, 23, 42, 0.08)",
  gradient: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
  gradientAccent: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: THEME.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "50%",
          height: "50%",
          background: THEME.primaryLight,
          filter: "blur(150px)",
          opacity: 0.1,
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          right: "-10%",
          width: "50%",
          height: "50%",
          background: THEME.accent,
          filter: "blur(150px)",
          opacity: 0.1,
          borderRadius: "50%",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          padding: "3rem",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "420px",
          border: "1px solid rgba(255,255,255,0.5)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
            }}
          >
            🛡️
          </motion.div>
          <h1
            style={{
              color: THEME.text,
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Admin Portal
          </h1>
          <p style={{ color: THEME.textSecondary }}>
            Sign in to access the dashboard
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: THEME.text,
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "12px",
                border: `2px solid ${THEME.border}`,
                background: "rgba(255,255,255,0.5)",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = THEME.primary)}
              onBlur={(e) => (e.target.style.borderColor = THEME.border)}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: THEME.text,
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "12px",
                border: `2px solid ${THEME.border}`,
                background: "rgba(255,255,255,0.5)",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = THEME.primary)}
              onBlur={(e) => (e.target.style.borderColor = THEME.border)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              background: THEME.gradient,
              color: "white",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(30, 64, 175, 0.2)",
            }}
          >
            Sign In
          </motion.button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              borderRadius: "12px",
              background: "#FEF2F2",
              color: "#EF4444",
              textAlign: "center",
              fontSize: "0.9rem",
              fontWeight: 500,
              border: "1px solid #FCA5A5",
            }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
