/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

/* Product data */
const INSURANCE_PRODUCTS = [
  {
    name: "Private Car Insurance",
    tag: "car-private",
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop&crop=center",
  },
  {
    name: "Commercial Car Insurance",
    tag: "car-commercial",
    image:
      "https://images.unsplash.com/photo-1714213624189-9a9fc8a0736a?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Two Wheeler Insurance",
    tag: "two-wheeler",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop&crop=center",
  },
  {
    name: "Commercial Truck Insurance",
    tag: "truck-commercial",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&h=800&fit=crop&crop=center",
  },
  {
    name: "Health Insurance",
    tag: "health",
    image:
      "https://images.unsplash.com/photo-1478476868527-002ae3f3e159?q=80&w=1471&auto=format&fit=crop",
  },
  {
    name: "Life Insurance",
    tag: "life",
    image:
      "https://media.istockphoto.com/id/1478932682/photo/family-enjoying-with-outdoor-activities-travel-trip-on-vacation.jpg?s=1024x1024&w=is&k=20&c=mRDZ2jz_513uGSgh2pC-JWMSm9MnkwYXVfl2ghlz484=",
  },
];

/* Motion variants */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.42, ease: "easeOut" },
  },
  hover: { y: -6, scale: 1.02, transition: { duration: 0.25 } },
  tap: { scale: 0.985, transition: { duration: 0.08 } },
};

export default function InsuranceList({ onSelect = () => {}, theme = {} }) {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      const card = carouselRef.current.children[index];
      if (card) {
        card.scrollIntoView({ behavior: "smooth", inline: "center" });
        setActiveIndex(index);
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Carousel/Grid container */}
      <motion.div
        ref={carouselRef}
        className="insurance-grid container carousel"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="list"
        aria-label="Insurance plans"
        style={{ padding: "1rem 0", alignItems: "stretch" }}
        onScroll={(e) => {
          const { scrollLeft, offsetWidth } = e.currentTarget;
          const index = Math.round(scrollLeft / offsetWidth);
          setActiveIndex(index);
        }}
      >
        {INSURANCE_PRODUCTS.map((product) => (
          <motion.article
            key={product.tag}
            className="insurance-card card"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onSelect(product)}
            role="button"
            tabIndex={0}
            aria-label={`${product.name}`}
            style={{
              cursor: "pointer",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="insurance-cover"
              style={{
                background: `url(${product.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "220px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  background: "rgba(0,0,0,0.5)",
                  width: "100%",
                  textAlign: "center",
                  padding: "0.8rem",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                  }}
                >
                  {product.name}
                </h3>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}
