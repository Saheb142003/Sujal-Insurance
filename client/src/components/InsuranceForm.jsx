import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SuccessTick from "./SuccessTick";

const WHATSAPP_NUMBER = "6200829766";

function getFieldsForProduct(tag) {
  
  const common = [
    {
      key: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name",
      col: "full",
    },
    {
      key: "phone",
      label: "Phone Number",
      type: "tel",
      required: true,
      placeholder: "10-digit mobile number",
      col: "full",
    },
    {
      key: "email",
      label: "Email (optional)",
      type: "email",
      required: false,
      placeholder: "you@example.com",
      col: "full",
    },
  ];

  if (tag === "car-private" || tag === "car-commercial") {
    return [
      ...common,
      {
        key: "regNo",
        label: "Vehicle Registration No.",
        type: "text",
        required: true,
        placeholder: "MH12AB1234",
        col: "full",
      },
      {
        key: "make",
        label: "Make (Brand)",
        type: "text",
        required: true,
        placeholder: "Hyundai / Maruti / Honda",
      },
      {
        key: "model",
        label: "Model",
        type: "text",
        required: true,
        placeholder: "i20 / Swift / City",
      },
      {
        key: "year",
        label: "Manufacture Year",
        type: "number",
        required: true,
        placeholder: "2020",
      },
      {
        key: "fuel",
        label: "Fuel Type",
        type: "select",
        required: true,
        options: ["Petrol", "Diesel", "CNG", "Electric"],
        col: "full",
      },
      {
        key: "prevClaims",
        label: "Number of Previous Claims",
        type: "number",
        required: false,
        placeholder: "0",
      },
      {
        key: "insuranceExpiry",
        label: "Existing Policy Expiry (YYYY-MM-DD)",
        type: "date",
        required: false,
        col: "full",
      },
      {
        key: "city",
        label: "City",
        type: "text",
        required: true,
        placeholder: "Your city",
      },
      {
        key: "pin",
        label: "Pincode",
        type: "text",
        required: true,
        placeholder: "6-digit pincode",
      },
      {
        key: "additional",
        label: "Additional Details",
        type: "textarea",
        required: false,
        placeholder: "Any other information",
        col: "full",
      },
    ];
  }

  if (tag === "two-wheeler") {
    return [
      ...common,
      {
        key: "regNo",
        label: "Vehicle Reg. No.",
        type: "text",
        required: true,
        placeholder: "MH12AB1234",
        col: "full",
      },
      {
        key: "engine",
        label: "Engine CC",
        type: "text",
        required: true,
        placeholder: "125 / 150 / 200",
      },
      {
        key: "year",
        label: "Year",
        type: "number",
        required: true,
        placeholder: "2019",
      },
      {
        key: "prevClaims",
        label: "Previous Claims",
        type: "number",
        required: false,
      },
      { key: "city", label: "City", type: "text", required: true },
      { key: "pin", label: "Pincode", type: "text", required: true },
      {
        key: "additional",
        label: "Additional Details",
        type: "textarea",
        required: false,
        col: "full",
      },
    ];
  }

  if (tag === "truck-commercial") {
    return [
      ...common,
      {
        key: "vehicleType",
        label: "Truck Type",
        type: "select",
        required: true,
        options: ["Open", "Closed", "Tanker", "Refrigerated"],
        col: "full",
      },
      { key: "regNo", label: "Reg. No.", type: "text", required: true },
      {
        key: "goodsValue",
        label: "Approx. Goods Value (₹)",
        type: "number",
        required: true,
      },
      {
        key: "loadCapacity",
        label: "Load Capacity (tons)",
        type: "text",
        required: true,
      },
      {
        key: "prevClaims",
        label: "Previous Claims",
        type: "number",
        required: false,
      },
      { key: "city", label: "Operating City", type: "text", required: true },
      { key: "pin", label: "Pincode", type: "text", required: true },
      {
        key: "additional",
        label: "Additional Details",
        type: "textarea",
        required: false,
        col: "full",
      },
    ];
  }

  if (tag === "health") {
    return [
      ...common,
      { key: "age", label: "Your Age", type: "number", required: true },
      {
        key: "sumInsured",
        label: "Desired Sum Insured (₹)",
        type: "number",
        required: true,
        placeholder: "5,00,000",
      },
      {
        key: "familyMembers",
        label: "Cover (Self / Family)",
        type: "select",
        required: true,
        options: ["Self", "Self + Spouse", "Family Floater"],
        col: "full",
      },
      {
        key: "preExisting",
        label: "Pre-existing Conditions (if any)",
        type: "textarea",
        required: false,
        col: "full",
      },
      {
        key: "smoker",
        label: "Smoker?",
        type: "select",
        options: ["No", "Yes"],
        required: true,
      },
      {
        key: "additional",
        label: "Additional Details",
        type: "textarea",
        required: false,
        col: "full",
      },
    ];
  }

  // life or default
  return [
    ...common,
    { key: "age", label: "Age", type: "number", required: true },
    {
      key: "sumInsured",
      label: "Desired Sum Insured (₹)",
      type: "number",
      required: true,
    },
    {
      key: "term",
      label: "Policy Term (years)",
      type: "number",
      required: true,
    },
    {
      key: "smoker",
      label: "Smoker?",
      type: "select",
      options: ["No", "Yes"],
      required: true,
    },
    {
      key: "healthCond",
      label: "Health Conditions (optional)",
      type: "textarea",
      required: false,
      col: "full",
    },
    {
      key: "additional",
      label: "Additional Details",
      type: "textarea",
      required: false,
      col: "full",
    },
  ];
}

export default function InsuranceForm({ product, onBack, theme, agent }) {
  // create initial state based on fields
  const fieldDefs = useMemo(
    () => getFieldsForProduct(product.tag),
    [product.tag]
  );

  const initialState = fieldDefs.reduce((acc, fld) => {
    acc[fld.key] = "";
    return acc;
  }, {});

  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const getWhatsAppLink = () => {
    const lines = [
      `Insurance Inquiry`,
      `Product: ${product.name}`,
      `Agent: ${agent.name} (IP: ${agent.ipCode})`,
      `----`,
    ];
    fieldDefs.forEach((f) => {
      const v = form[f.key];
      if (v !== undefined && v !== "") lines.push(`${f.label}: ${v}`);
    });
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
  };

  const validate = () => {
    
    for (const fld of fieldDefs) {
      if (fld.required) {
        const v = form[fld.key];
        if (!v && v !== 0)
          return { ok: false, msg: `${fld.label} is required` };
        if (fld.key === "phone") {
          const raw = (form.phone || "").replace(/\D/g, "");
          if (!/^\d{10,13}$/.test(raw))
            return {
              ok: false,
              msg: "Enter valid mobile number (10-13 digits)",
            };
        }
        if (fld.key === "pin") {
          if (!/^\d{6}$/.test((form.pin || "").trim()))
            return { ok: false, msg: "Enter valid 6-digit pincode" };
        }
      }
    }
    return { ok: true };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (!v.ok) {
      alert(v.msg);
      return;
    }
    setSubmitting(true);
    
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      window.open(getWhatsAppLink(), "_blank");
      setTimeout(() => setSent(false), 2800);
    }, 900);
  };

  return (
    <motion.div
      className="card form-wrapper"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.36 }}
      style={{ padding: "1.4rem", borderRadius: 16 }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <button className="btn btn-ghost" onClick={onBack} aria-label="Back">
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: "1.05rem",
              color: theme.primary,
            }}
          >
            {product.name} Inquiry
          </div>
          <div style={{ fontSize: 13, color: theme.textSecondary }}>
            {product.desc}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 74,
            height: 74,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${theme.primary}22, ${theme.primaryLight}22), url(${product.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          {product.icon}
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>{agent.name}</div>
          <div style={{ fontSize: 13, color: theme.textSecondary }}>
            IP: {agent.ipCode} • Rating: {agent.rating}/5
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 6 }}>
        <div className="form-grid">
          {fieldDefs.map((fld) => {
            const value = form[fld.key] ?? "";
            const isFull = fld.col === "full";
            const className = isFull ? "full" : "";
            if (fld.type === "textarea") {
              return (
                <div key={fld.key} className={className}>
                  <label className="kicker">
                    {fld.label}
                    {fld.required ? " *" : ""}
                  </label>
                  <textarea
                    value={value}
                    placeholder={fld.placeholder || ""}
                    onChange={(e) => update(fld.key, e.target.value)}
                    rows={4}
                    style={{ width: "100%" }}
                  />
                </div>
              );
            }

            if (fld.type === "select") {
              return (
                <div key={fld.key} className={className}>
                  <label className="kicker">
                    {fld.label}
                    {fld.required ? " *" : ""}
                  </label>
                  <select
                    value={value}
                    onChange={(e) => update(fld.key, e.target.value)}
                  >
                    <option value="">Select</option>
                    {fld.options &&
                      fld.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={fld.key} className={className}>
                <label className="kicker">
                  {fld.label}
                  {fld.required ? " *" : ""}
                </label>
                <input
                  className="input"
                  value={value}
                  type={fld.type}
                  placeholder={fld.placeholder || ""}
                  onChange={(e) => update(fld.key, e.target.value)}
                />
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 16 }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              backgroundColor: "#25D366",
              theme: "solid",
              color: "white",
              width: "100%",
              padding: "0.85rem 1rem",
              borderRadius: 12,
              fontSize: 15,
            }}
            disabled={submitting}
          >
            {submitting
              ? "Connecting to WhatsApp..."
              : "💬 Send Inquiry via WhatsApp"}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {sent && (
          <SuccessTick
            theme={theme}
            message="Inquiry sent — opening WhatsApp"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
