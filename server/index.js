const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*", // Default to allow all if not specified (dev mode)
  })
);
app.use(express.json());

// Connect to MongoDB
// Check for critical environment variables
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/policies", require("./routes/policies"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
