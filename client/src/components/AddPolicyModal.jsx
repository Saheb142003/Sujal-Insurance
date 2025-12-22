import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addYears } from "date-fns";
import api from "../api/axios";

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

const AddPolicyModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialDate,
  policy,
}) => {
  const [formData, setFormData] = useState({
    clientName: "",
    vehicleNo: "",
    phone: "",
    amount: "",
    discount: "",
    endDate: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    vehicleCategory: "Car",
    commercialType: "",
    policyType: "1st Party",
  });

  useEffect(() => {
    if (isOpen) {
      if (policy) {
        // Edit Mode
        setFormData({
          clientName: policy.clientName,
          vehicleNo: policy.vehicleNo,
          phone: policy.phone,
          amount: policy.amount,
          discount: policy.discount || "",
          endDate: format(new Date(policy.endDate), "yyyy-MM-dd"),
          startDate: format(new Date(policy.startDate), "yyyy-MM-dd"),
          vehicleCategory: ["Car", "Bike"].includes(policy.vehicleType)
            ? policy.vehicleType
            : "Commercial",
          commercialType: ["Car", "Bike"].includes(policy.vehicleType)
            ? ""
            : policy.vehicleType,
          policyType: policy.policyType || "1st Party",
        });
      } else if (initialDate) {
        // Add Mode with initial date
        setFormData((prev) => ({
          ...prev,
          startDate: format(initialDate, "yyyy-MM-dd"),
          endDate: format(addYears(initialDate, 1), "yyyy-MM-dd"), // Default to 1 year later
          vehicleCategory: "Car",
          commercialType: "",
          policyType: "1st Party",
          clientName: "",
          vehicleNo: "",
          phone: "",
          amount: "",
          discount: "",
        }));
      }
    }
  }, [isOpen, initialDate, policy]);

  // Update End Date when Start Date changes (only if not editing or if user wants it - keeping it simple for now)
  // Actually, let's just update it when the user changes the start date manually
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    if (newStartDate) {
      try {
        const dateObj = new Date(newStartDate);
        const newEndDate = format(addYears(dateObj, 1), "yyyy-MM-dd");
        setFormData((prev) => ({
          ...prev,
          startDate: newStartDate,
          endDate: newEndDate,
        }));
      } catch (err) {
        // Invalid date, just update start date
        setFormData((prev) => ({ ...prev, startDate: newStartDate }));
      }
    } else {
      setFormData((prev) => ({ ...prev, startDate: newStartDate }));
    }
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    try {
      const vehicleType =
        formData.vehicleCategory === "Commercial"
          ? formData.commercialType
          : formData.vehicleCategory;

      if (!vehicleType) {
        alert("Please specify the commercial vehicle type");
        return;
      }

      const payload = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        amount: Number(formData.amount),
        discount: Number(formData.discount || 0),
        vehicleType,
      };

      if (policy) {
        await api.put(`/policies/${policy._id}`, payload);
      } else {
        await api.post("/policies", payload);
      }

      setFormData({
        clientName: "",
        vehicleNo: "",
        phone: "",
        amount: "",
        discount: "",
        endDate: "",
        startDate: format(initialDate || new Date(), "yyyy-MM-dd"),
        vehicleCategory: "Car",
        commercialType: "",
        policyType: "1st Party",
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving policy:", err);
      alert("Failed to save policy. Please check the console for details.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
              }}
            >
              Add New Policy
            </h3>
            <form onSubmit={handleAddPolicy}>
              <div style={{ display: "grid", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Client Name"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1px solid ${THEME.border}`,
                    width: "100%",
                  }}
                />
                <input
                  type="text"
                  placeholder="Vehicle No"
                  value={formData.vehicleNo}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleNo: e.target.value })
                  }
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1px solid ${THEME.border}`,
                    width: "100%",
                  }}
                />

                {/* Vehicle Type Selection */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Vehicle Type
                  </label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    {["Car", "Bike", "Commercial"].map((type) => (
                      <label
                        key={type}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="vehicleCategory"
                          value={type}
                          checked={formData.vehicleCategory === type}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              vehicleCategory: e.target.value,
                            })
                          }
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Commercial Type Input */}
                {formData.vehicleCategory === "Commercial" && (
                  <input
                    type="text"
                    placeholder="Specify Commercial Type (e.g. Truck)"
                    value={formData.commercialType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        commercialType: e.target.value,
                      })
                    }
                    required
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${THEME.border}`,
                      width: "100%",
                    }}
                  />
                )}

                {/* Policy Type Selection */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Policy Type
                  </label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    {["1st Party", "3rd Party"].map((type) => (
                      <label
                        key={type}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name="policyType"
                          value={type}
                          checked={formData.policyType === type}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              policyType: e.target.value,
                            })
                          }
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: `1px solid ${THEME.border}`,
                    width: "100%",
                  }}
                />
                <div style={{ display: "flex", gap: "1rem" }}>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${THEME.border}`,
                      width: "100%",
                      flex: 1,
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Discount"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${THEME.border}`,
                      width: "100%",
                      flex: 1,
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${THEME.border}`,
                      width: "100%",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={handleStartDateChange}
                    required
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${THEME.border}`,
                      width: "100%",
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    background: THEME.bg,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "none",
                    background: THEME.primary,
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {policy ? "Update Policy" : "Add Policy"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddPolicyModal;
