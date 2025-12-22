import { useState, useEffect, useContext } from "react";
import AddPolicyModal from "../components/AddPolicyModal";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [editingPolicy, setEditingPolicy] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredPolicies = policies.filter((policy) =>
    policy.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <button
              onClick={() => navigate(-1)}
              style={{
                textDecoration: "none",
                color: THEME.textSecondary,
                fontSize: "1.5rem",
                fontWeight: 700,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              ←
            </button>
            <h1
              style={{ fontSize: "2rem", fontWeight: 800, color: THEME.text }}
            >
              Policies
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
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
            + Add Policy
          </motion.button>
        </div>

        {/* Search Input */}
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Search by Vehicle No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "12px",
              borderRadius: "12px",
              border: `1px solid ${THEME.border}`,
              fontSize: "1rem",
              outline: "none",
            }}
          />
        </div>

        <AddPolicyModal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingPolicy(null);
          }}
          onSuccess={fetchPolicies}
          initialDate={new Date()}
          policy={editingPolicy}
        />

        <div
          style={{
            background: THEME.card,
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            overflowX: "auto", // Enable horizontal scroll for table
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "600px",
            }}
          >
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
                <Th>Financials</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map((policy) => (
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
                  <Td>
                    <div style={{ fontWeight: 600 }}>{policy.vehicleNo}</div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: THEME.textSecondary,
                        textTransform: "capitalize",
                      }}
                    >
                      {policy.vehicleType}
                    </div>
                  </Td>
                  <Td>
                    <div style={{ fontSize: "0.9rem" }}>
                      {new Date(policy.startDate).toLocaleDateString()} -{" "}
                      {new Date(policy.endDate).toLocaleDateString()}
                    </div>
                  </Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>₹{policy.amount}</div>
                    {policy.discount > 0 && (
                      <div
                        style={{ fontSize: "0.85rem", color: THEME.success }}
                      >
                        Disc: ₹{policy.discount}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: THEME.primary,
                        marginTop: "0.2rem",
                        fontWeight: 500,
                      }}
                    >
                      {policy.policyType}
                    </div>
                  </Td>
                  <Td>
                    <button
                      onClick={() => {
                        setEditingPolicy(policy);
                        setShowForm(true);
                      }}
                      style={{
                        color: THEME.primary,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                        marginRight: "1rem",
                      }}
                    >
                      Edit
                    </button>
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
          {filteredPolicies.length === 0 && !loading && (
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

const Th = ({ children }) => (
  <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.9rem" }}>
    {children}
  </th>
);

const Td = ({ children }) => (
  <td style={{ padding: "1rem", color: THEME.text }}>{children}</td>
);

export default Policies;
