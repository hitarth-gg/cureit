// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
router.post("/register", async (req, res) => {
  console.log("Hit /register route");
  const { email, mobile, password, name, role } = req.body;
  if (!email || !mobile || !password || !name || !role) {
    console.log("Missing fields in request body"); 
    return res.status(400).json({ error: "All fields are required" });
  }
  console.log("Request body:", req.body);
  try {
    const { data, error } = await supabase.from("users").insert([
      {
        email: email,
        full_name: name,
        role: role,
        phone_number: mobile,
      },
    ]).select("*").single();
    if (error) {
      console.error("Error inserting user into Supabase:", error);
      return res.status(400).json({ error: error.message });
    }
    console.log("Inserted user:", data); 
    res.status(201).json({ message: "User registered successfully", user: data });
  } catch (err) {
    console.error("Unexpected error:", err); 
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
