import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const THEME = {
  primary: "#1E40AF",
  primaryDark: "#1E3A8A",
  primaryLight: "#3B82F6",
  accent: "#F59E0B",
  accentDark: "#D97706",
  success: "#10B981",
  danger: "#EF4444",
  bg: "#F8FAFC",
  bgSecondary: "#F1F5F9",
  card: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#475569",
  border: "#E2E8F0",
};

const Policies = () => {
  const { token } = useContext(AuthContext);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    vehicleNo: "",
    phone: "",
    startDate: "",
    endDate: "",
    amount: "",
  });

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { "x-auth-token": token },
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await api.get("/policies");
      setPolicies(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/policies", formData);
      fetchPolicies();
      setShowForm(false);
      setFormData({
        clientName: "",
        vehicleNo: "",
        phone: "",
        startDate: "",
        endDate: "",
        amount: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/policies/${id}`);
        fetchPolicies();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: THEME.bg,
        padding: "2rem",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                color: THEME.textSecondary,
                fontSize: "1.5rem",
                fontWeight: 700,
              }}
            >
              ←
            </Link>
            <h1
              style={{ fontSize: "2rem", fontWeight: 800, color: THEME.text }}
            >
              Policies
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            style={{
              background: THEME.primary,
              color: "white",
              border: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "12px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(30, 64, 175, 0.2)",
            }}
          >
            {showForm ? "Close Form" : "+ Add Policy"}
          </motion.button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={onSubmit}
              style={{
                background: THEME.card,
                padding: "2rem",
                borderRadius: "16px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                marginBottom: "2rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                <Input
                  label="Client Name"
                  name="clientName"
                  value={formData.clientName}
                  onChange={onChange}
                />
                <Input
                  label="Vehicle No"
                  name="vehicleNo"
                  value={formData.vehicleNo}
                  onChange={onChange}
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                />
                <Input
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={onChange}
                />
                <Input
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={onChange}
                />
                <Input
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={onChange}
                />
              </div>
              <div style={{ marginTop: "2rem", textAlign: "right" }}>
                <button
                  type="submit"
                  style={{
                    background: THEME.success,
                    color: "white",
                    border: "none",
                    padding: "0.8rem 2rem",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Save Policy
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div
          style={{
            background: THEME.card,
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: THEME.bgSecondary,
                  textAlign: "left",
                  color: THEME.textSecondary,
                }}
              >
                <Th>Client</Th>
                <Th>Vehicle</Th>
                <Th>Dates</Th>
                <Th>Amount</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr
                  key={policy._id}
                  style={{ borderBottom: `1px solid ${THEME.border}` }}
                >
                  <Td>
                    <div style={{ fontWeight: 600 }}>{policy.clientName}</div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: THEME.textSecondary,
                      }}
                    >
                      {policy.phone}
                    </div>
                  </Td>
                  <Td>{policy.vehicleNo}</Td>
                  <Td>
                    <div style={{ fontSize: "0.9rem" }}>
                      {new Date(policy.startDate).toLocaleDateString()} -{" "}
                      {new Date(policy.endDate).toLocaleDateString()}
                    </div>
                  </Td>
                  <Td>₹{policy.amount}</Td>
                  <Td>
                    <button
                      onClick={() => handleDelete(policy._id)}
                      style={{
                        color: THEME.danger,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Delete
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
          {policies.length === 0 && !loading && (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: THEME.textSecondary,
              }}
            >
              No policies found. Add one to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label
      style={{
        display: "block",
        marginBottom: "0.5rem",
        fontSize: "0.9rem",
        fontWeight: 600,
        color: THEME.text,
      }}
    >
      {label}
    </label>
    <input
      {...props}
      style={{
        width: "100%",
        padding: "0.8rem",
        borderRadius: "8px",
        border: `1px solid ${THEME.border}`,
        outline: "none",
        fontSize: "1rem",
      }}
    />
  </div>
);

const Th = ({ children }) => (
  <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.9rem" }}>
    {children}
  </th>
);

const Td = ({ children }) => (
  <td style={{ padding: "1rem", color: THEME.text }}>{children}</td>
);

export default Policies;
