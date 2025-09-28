import React from "react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Happy Clients", value: "90+", icon: "👥", color: "#10B981" },
  { label: "Policies Sold", value: "100+", icon: "📋", color: "#1E40AF" },
  { label: "Years Experience", value: "1.5+", icon: "⏳", color: "#F59E0B" },
  { label: "Client Rating", value: "4.8/5", icon: "⭐", color: "#EF4444" },
];

export default function StatsSection({ theme }) {
  return (
    <motion.section
      className="stats-section container"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      aria-label="Agent stats"
    >
      <div className="stats-row" role="list">
        {STATS.map((s, i) => (
          <motion.div
            role="listitem"
            key={s.label}
            className="stats-item card"
            style={{ minWidth: 160 }}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.12 + i * 0.06 }}
          >
            <div className="icon" aria-hidden>
              {s.icon}
            </div>
            <div className="value" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="label">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
