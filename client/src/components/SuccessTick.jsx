import React from "react";
import { motion } from "framer-motion";

export default function SuccessTick({ theme }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{
        scale: [0, 1.1, 1],
        opacity: 1,
        rotate: 0,
      }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        times: [0, 0.7, 1],
      }}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: theme.success,
        color: "#ffffff",
        borderRadius: "20px",
        padding: "2rem 2.5rem",
        boxShadow: `0 8px 32px ${theme.success}40`,
        zIndex: 1000,
        textAlign: "center",
        minWidth: "300px",
        border: `2px solid ${theme.success}`,
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{
          fontSize: "4rem",
          marginBottom: "1rem",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
        }}
      >
        ✅
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          lineHeight: 1.4,
        }}
      >
        Message Sent Successfully!
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        style={{
          fontSize: "1rem",
          fontWeight: 500,
          opacity: 0.9,
          lineHeight: 1.5,
        }}
      >
        Redirecting to WhatsApp...
      </motion.div>

      <motion.div
        animate={{
          scale: [1, 2, 3],
          opacity: [0.3, 0.1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: theme.success,
          transform: "translate(-50%, -50%)",
          zIndex: -1,
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.5, 2],
          opacity: [0.2, 0.1, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5,
        }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: theme.success,
          transform: "translate(-50%, -50%)",
          zIndex: -1,
        }}
      />
    </motion.div>
  );
}
