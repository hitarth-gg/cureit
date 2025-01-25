// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const supabase = require("../config/supabaseClient");

// Register a new user
router.post("/register", async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    // Save user data to MongoDB
    const newUser = await User.create({
      userId: data.user.id,
      name,
      email,
      role,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({ message: "Login successful", token: data.session.access_token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
