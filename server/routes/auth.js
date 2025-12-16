const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    if (password !== user.password) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Login Error:", err.message);
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables!");
    }
    res.status(500).send("Server error: " + err.message);
  }
});

// Seed Admin (Temporary)
router.get("/seed", async (req, res) => {
  try {
    await User.deleteMany({}); // Clear existing users
    const user = new User({
      username: "admin",
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      password: process.env.ADMIN_PASSWORD || "admin",
    });
    await user.save();
    res.send("Admin seeded successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
