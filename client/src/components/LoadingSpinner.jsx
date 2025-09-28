

import React from "react";
import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #F59E0B 100%)",
        zIndex: 9999,
      }}
    >
  
  
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "6px solid rgba(255, 255, 255, 0.3)",
          borderTop: "6px solid #ffffff",
          marginBottom: "2rem",
        }}
      />


      <div style={{ display: "flex", gap: "8px", marginBottom: "2rem" }}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#ffffff",
            }}
          />
        ))}
      </div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          color: "#ffffff",
          fontSize: "1.4rem",
          fontWeight: 600,
          textAlign: "center",
          letterSpacing: "0.5px",
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading Sujal Insurance
        </motion.span>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{
          color: "#ffffff",
          fontSize: "1rem",
          fontWeight: 400,
          marginTop: "0.5rem",
          textAlign: "center",
        }}
      >
        loading your insurance solutions...
      </motion.div>


      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(20px)",
        }}
      />

      <motion.div
        animate={{
          rotate: [360, 0],
          scale: [1.2, 0.8, 1.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          bottom: "25%",
          right: "15%",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.15)",
          filter: "blur(25px)",
        }}
      />
    </motion.div>
  );
}
