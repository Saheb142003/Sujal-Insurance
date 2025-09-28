/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const FLOATING_ELEMENTS = [
  {
    id: 1,
    size: 60,
    color: "#3B82F6",
    top: "10%",
    left: "8%",
    duration: 6,
    blur: 25,
  },
  {
    id: 2,
    size: 40,
    color: "#F59E0B",
    top: "25%",
    right: "12%",
    duration: 8,
    blur: 20,
  },
  {
    id: 3,
    size: 50,
    color: "#10B981",
    bottom: "15%",
    left: "15%",
    duration: 7,
    blur: 22,
  },
  {
    id: 4,
    size: 35,
    color: "#8B5CF6",
    bottom: "8%",
    right: "8%",
    duration: 9,
    blur: 18,
  },
  {
    id: 5,
    size: 45,
    color: "#EF4444",
    top: "50%",
    left: "50%",
    duration: 5,
    blur: 20,
  },
  {
    id: 6,
    size: 30,
    color: "#06B6D4",
    top: "70%",
    right: "25%",
    duration: 10,
    blur: 15,
  },
];

export default function FloatingElements() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {FLOATING_ELEMENTS.map((element) => (
        <motion.div
          key={element.id}
          initial={{
            opacity: 0,
            scale: 0.3,
            rotate: 0,
          }}
          animate={{
            opacity: [0, 0.3, 0.2, 0.4, 0.1],
            scale: [0.8, 1.2, 0.9, 1.1, 1],
            rotate: [0, 180, 360],
            y: [0, -20, 10, -15, 0],
            x: [0, 10, -5, 8, 0],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: element.id * 0.5,
          }}
          style={{
            position: "absolute",
            width: element.size,
            height: element.size,
            background: `radial-gradient(circle, ${element.color}40, ${element.color}20, transparent)`,
            borderRadius: "50%",
            filter: `blur(${element.blur}px)`,
            ...Object.fromEntries(
              Object.entries(element).filter(([key]) =>
                ["top", "bottom", "left", "right"].includes(key)
              )
            ),
          }}
        />
      ))}

      {/* Additional decorative shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 360],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: "20%",
          left: "70%",
          width: "200px",
          height: "200px",
          background:
            "conic-gradient(from 0deg, #3B82F620, #F59E0B20, #10B98120, #3B82F620)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.05, 0.2, 0.05],
          rotate: [360, 0],
          scale: [1.2, 0.8, 1.2],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          bottom: "30%",
          right: "60%",
          width: "150px",
          height: "150px",
          background:
            "conic-gradient(from 180deg, #8B5CF620, #EF444420, #06B6D420, #8B5CF620)",
          borderRadius: "50%",
          filter: "blur(35px)",
        }}
      />
    </div>
  );
}
