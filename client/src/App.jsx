/* eslint-disable no-unused-vars */
/* App.jsx */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InsuranceList from "./components/InsuranceList.jsx";
import InsuranceForm from "./components/InsuranceForm.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import FloatingElements from "./components/FloatingElements.jsx";
import StatsSection from "./components/StatsSection.jsx";

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

const AGENT_PROFILE = {
  name: "SUJAL VISHWAKARMA",
  ipCode: "318123",
  city: "Dhanbad",
  state: "Jharkhand",
  years: 1.5,
  policies: 100,
  rating: 4.8,
  clients: 90,
  specialization: "Vehicle & Health Insurance",
};

export default function App() {
  const [chosenProduct, setChosenProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  // mobile header open state (only used on small screens; CSS controls visibility)
  const [headerOpen, setHeaderOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      style={{
        background: THEME.bg,
        minHeight: "100vh",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingElements />

      {/* Header with glassmorphism effect */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          background: `linear-gradient(135deg, ${THEME.primary}ee, ${THEME.primaryDark}dd)`,
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
          color: "#fff",
          padding: "1.25rem 1rem",
          position: "relative",
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}
        >
          <motion.h1
            onClick={() => setHeaderOpen((s) => !s)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 6vw, 3.5rem)",
              letterSpacing: "-0.02em",
              textAlign: "center",
              background: "linear-gradient(135deg, #ffffff, #e2e8f0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.6rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
            aria-expanded={headerOpen}
            aria-controls="agent-profile"
          >
            Sujal Insurance
            {/* small chevron -- rotates when open */}
            <motion.span
              animate={{ rotate: headerOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              style={{
                fontSize: 16,
                color: "white",
                opacity: 0.95,
                display: "inline-block",
                transformOrigin: "center",
              }}
            >
              ▾
            </motion.span>
          </motion.h1>

          {/* Header details: visible on large screens; on phones hidden by default and shown when headerOpen */}
          <div
            id="agent-profile"
            className={`header-details ${headerOpen ? "open" : ""}`}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div
              className="header-card"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "1rem",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div style={{ fontSize: "1.05rem", fontWeight: 800 }}>
                {AGENT_PROFILE.name}
              </div>
              <div style={{ opacity: 0.95, fontSize: "0.95rem" }}>
                Licensed Agent • IP Code: {AGENT_PROFILE.ipCode}
              </div>
              <div style={{ opacity: 0.85, fontSize: "0.9rem", marginTop: 6 }}>
                📍 {AGENT_PROFILE.city}, {AGENT_PROFILE.state}
              </div>
            </div>

            <div
              className="header-card"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                padding: "1rem",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div style={{ fontSize: "1.05rem", fontWeight: 800 }}>
                {AGENT_PROFILE.specialization}
              </div>
              <div style={{ opacity: 0.95, fontSize: "0.95rem" }}>
                ⭐ {AGENT_PROFILE.rating}/5.0 Rating • {AGENT_PROFILE.years} +
                Year Experience
              </div>
              <div style={{ opacity: 0.85, fontSize: "0.9rem", marginTop: 6 }}>
                {AGENT_PROFILE.policies}+ Policies Sold •{" "}
                {AGENT_PROFILE.clients} Happy Clients
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.2rem 1rem" }}
      >
        <StatsSection theme={THEME} />

        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          style={{ marginBottom: "2.5rem", textAlign: "center" }}
        >
          <h2
            style={{
              color: THEME.primary,
              fontSize: "clamp(1.5rem, 4vw, 2.6rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "0.8rem",
            }}
          >
            Choose Your Protection Plan
          </h2>
          <p
            style={{
              color: THEME.textSecondary,
              fontSize: "1.05rem",
              maxWidth: "640px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Select from our comprehensive insurance products and get instant
            expert assistance via WhatsApp
          </p>
        </motion.section>

        <AnimatePresence mode="wait">
          {!chosenProduct ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <InsuranceList onSelect={setChosenProduct} theme={THEME} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <InsuranceForm
                product={chosenProduct}
                onBack={() => setChosenProduct(null)}
                theme={THEME}
                agent={AGENT_PROFILE}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{
          background: THEME.gradient,
          color: "#fff",
          textAlign: "center",
          padding: "2.5rem 1rem 1.5rem",
          marginTop: "2rem",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              marginBottom: "0.7rem",
            }}
          >
            🛡️ Your Insurance Partner
          </div>
          <p style={{ opacity: 0.9, fontSize: "1rem", marginBottom: "1.6rem" }}>
            Professional insurance services with personalized attention and
            expert guidance
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1.5rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
              fontSize: "0.95rem",
              opacity: 0.85,
            }}
          >
            <span>📞 24/7 Support</span>
            <span>✅ Licensed Agent</span>
            <span>🏆 Top Rated Service</span>
            <span>💯 Client Satisfaction</span>
          </div>
          <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
            © 2025 Sujal Insurance • Professional Insurance Services
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
