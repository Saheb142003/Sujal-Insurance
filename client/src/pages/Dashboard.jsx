import React, { useState, useEffect, useContext } from "react";
import AddPolicyModal from "../components/AddPolicyModal";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const THEME = {
  primary: "#1E40AF",
  primaryLight: "#3B82F6",
  bg: "#F8FAFC",
  text: "#0F172A",
  textSecondary: "#475569",
  border: "#E2E8F0",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
};

const Dashboard = () => {
  const { user, token, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [policies, setPolicies] = useState({ starting: [], expiring: [] });
  const [allPolicies, setAllPolicies] = useState([]); // For calendar indicators
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (token) {
      fetchPoliciesForDate(selectedDate);
      fetchAllPolicies();
    }
  }, [selectedDate, token]);

  const fetchPoliciesForDate = async (date) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const res = await api.get(`/policies/date/${formattedDate}`);
      setPolicies(res.data);
    } catch (err) {
      console.error("Error fetching policies:", err);
    }
  };

  const fetchAllPolicies = async () => {
    try {
      const res = await api.get("/policies");
      setAllPolicies(res.data);
    } catch (err) {
      console.error("Error fetching all policies:", err);
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const daysInMonth = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: isMobile ? "4px" : "8px",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: THEME.textSecondary,
              fontSize: isMobile ? "0.8rem" : "0.9rem",
              padding: "10px 0",
            }}
          >
            {d}
          </div>
        ))}
        {daysInMonth.map((dayItem, i) => {
          const isSelected = isSameDay(dayItem, selectedDate);
          const isCurrentMonth = isSameMonth(dayItem, monthStart);
          const isTodayDate = isToday(dayItem);

          // Check for activity
          const policiesOnDay = allPolicies.filter(
            (p) =>
              isSameDay(parseISO(p.startDate), dayItem) ||
              isSameDay(parseISO(p.endDate), dayItem)
          );

          const hasActivity = policiesOnDay.length > 0;

          // Check for expirations
          const expiringOnDay = allPolicies.filter((p) =>
            isSameDay(parseISO(p.endDate), dayItem)
          );

          // Check if any policy expiring on this day is in the current week relative to today
          const isExpiringThisWeek = expiringOnDay.some((p) => {
            const expiry = parseISO(p.endDate);
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);
            return expiry >= today && expiry <= nextWeek;
          });

          const isExpiringMonth = expiringOnDay.length > 0 && isCurrentMonth;

          // Determine Background Color
          let bg = "white";
          if (isSelected) bg = THEME.primary;
          else if (isExpiringThisWeek) bg = THEME.danger;
          else if (isExpiringMonth) bg = "#EAB308";
          else if (isTodayDate) bg = "#DBEAFE";

          // Determine Text Color
          let color = "#CBD5E1"; // Default disabled
          if (isCurrentMonth) {
            if (isSelected) color = "white";
            else if (isExpiringThisWeek) color = "white";
            else if (isExpiringMonth) color = "white";
            else color = THEME.text;
          }

          return (
            <motion.div
              key={dayItem.toString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(dayItem)}
              style={{
                padding: isMobile ? "8px 4px" : "10px",
                borderRadius: "12px",
                background: bg,
                color: color,
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
                boxShadow: isSelected
                  ? "0 0 0 3px rgba(30, 64, 175, 0.3)" // Ring effect for selection
                  : "none",
                border:
                  isTodayDate &&
                  !isSelected &&
                  !isExpiringThisWeek &&
                  !isExpiringMonth
                    ? `1px solid ${THEME.primaryLight}`
                    : "none",
                opacity: isCurrentMonth ? 1 : 0.4,
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            >
              <span style={{ fontWeight: 600 }}>
                {format(dayItem, dateFormat)}
              </span>
              {/* Only show dot for starting policies if no expiration alert */}
              {hasActivity && !isExpiringThisWeek && !isExpiringMonth && (
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: isSelected ? "white" : THEME.success,
                    margin: "4px auto 0",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: THEME.bg,
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden", // Prevent horizontal scroll
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "white",
          padding: isMobile ? "1rem" : "1rem 2rem",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "1rem" : "0",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{ fontSize: "1.5rem", fontWeight: 800, color: THEME.primary }}
        >
          Admin Dashboard
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => navigate("/policies")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: THEME.primaryLight,
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Policies
          </button>
          <span style={{ fontWeight: 600, color: THEME.text }}>
            {user?.username || "Admin"}
          </span>
          <button
            onClick={logout}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: `1px solid ${THEME.border}`,
              background: "transparent",
              cursor: "pointer",
              fontWeight: 600,
              color: THEME.textSecondary,
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1400px",
          margin: isMobile ? "1rem auto" : "2rem auto",
          padding: isMobile ? "0 0.5rem" : "0 1rem",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 400px",
          gap: "2rem",
        }}
      >
        {/* Left Column: Calendar */}
        <div
          style={{
            background: "white",
            padding: isMobile ? "0.75rem" : "2rem",
            borderRadius: "24px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? "1.4rem" : "1.8rem",
                fontWeight: 700,
                color: THEME.text,
              }}
            >
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                }}
              >
                ←
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: 600,
                  color: THEME.primary,
                }}
              >
                Today
              </button>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                }}
              >
                →
              </button>
            </div>
          </div>
          {renderCalendar()}
        </div>

        {/* Right Column: Day Details */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <div
            style={{
              background: "white",
              padding: isMobile ? "1rem" : "1.5rem",
              borderRadius: "24px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: THEME.text,
                }}
              >
                {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: THEME.primary,
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                + Add Policy
              </button>
            </div>

            {/* Starting Policies */}
            <div style={{ marginBottom: "2rem" }}>
              <h4
                style={{
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: THEME.textSecondary,
                  marginBottom: "1rem",
                }}
              >
                Starting Today ({policies.starting.length})
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {policies.starting.length === 0 && (
                  <p
                    style={{ color: THEME.textSecondary, fontStyle: "italic" }}
                  >
                    No policies starting today.
                  </p>
                )}
                {policies.starting.map((policy) => (
                  <div
                    key={policy._id}
                    style={{
                      padding: "1rem",
                      borderRadius: "12px",
                      background: "#F0F9FF",
                      border: "1px solid #BAE6FD",
                      position: "relative",
                    }}
                  >
                    <button
                      onClick={() => {
                        setEditingPolicy(policy);
                        setShowForm(true);
                      }}
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        background: "none",
                        border: "none",
                        color: THEME.primary,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      Edit
                    </button>
                    <div style={{ fontWeight: 700, color: THEME.text }}>
                      {policy.clientName}
                    </div>
                    <div
                      style={{ fontSize: "0.9rem", color: THEME.textSecondary }}
                    >
                      Vehicle: {policy.vehicleNo}
                    </div>
                    <div
                      style={{ fontSize: "0.9rem", color: THEME.textSecondary }}
                    >
                      Phone: {policy.phone}
                    </div>
                    <div
                      style={{ fontSize: "0.9rem", color: THEME.textSecondary }}
                    >
                      Amount: ₹{policy.amount}{" "}
                      {policy.discount > 0 && `(Disc: ₹${policy.discount})`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expiring Policies */}
            <div>
              <h4
                style={{
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: THEME.textSecondary,
                  marginBottom: "1rem",
                }}
              >
                Expiring Today ({policies.expiring.length})
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {policies.expiring.length === 0 && (
                  <p
                    style={{ color: THEME.textSecondary, fontStyle: "italic" }}
                  >
                    No policies expiring today.
                  </p>
                )}
                {policies.expiring.map((policy) => (
                  <div
                    key={policy._id}
                    style={{
                      padding: "1rem",
                      borderRadius: "12px",
                      background: "#FEF2F2",
                      border: "1px solid #FECACA",
                      position: "relative",
                    }}
                  >
                    <button
                      onClick={() => {
                        setEditingPolicy(policy);
                        setShowForm(true);
                      }}
                      style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        background: "none",
                        border: "none",
                        color: THEME.primary,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      Edit
                    </button>
                    <div style={{ fontWeight: 700, color: THEME.text }}>
                      {policy.clientName}
                    </div>
                    <div
                      style={{ fontSize: "0.9rem", color: THEME.textSecondary }}
                    >
                      Vehicle: {policy.vehicleNo}
                    </div>
                    <div
                      style={{ fontSize: "0.9rem", color: THEME.textSecondary }}
                    >
                      Phone: {policy.phone}
                    </div>
                    <div
                      style={{ fontSize: "0.9rem", color: THEME.textSecondary }}
                    >
                      Amount: ₹{policy.amount}{" "}
                      {policy.discount > 0 && `(Disc: ₹${policy.discount})`}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: THEME.danger,
                        fontWeight: 600,
                        marginTop: "0.5rem",
                      }}
                    >
                      EXPIRES TODAY
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Policy Modal */}
      <AddPolicyModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPolicy(null);
        }}
        onSuccess={() => {
          fetchPoliciesForDate(selectedDate);
          fetchAllPolicies();
        }}
        initialDate={selectedDate}
        policy={editingPolicy}
      />
    </div>
  );
};

export default Dashboard;
