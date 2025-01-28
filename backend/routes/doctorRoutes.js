// routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
// Fetch all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("availableSlots");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new doctor
router.post("/", async (req, res) => {
  const { userId, specialization, experience, hospital, available_from , available_to } = req.body;
  const {data , error } = await supabase.from('doctors').insert([
    {
      user_id: userId,
      specialization: specialization,
      experience_years: experience,
      hospital_name: hospital,
      available_from: available_from,
      available_to: available_to
    }
  ]).select('*').single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data[0]);
  console.log("Doctor added successfully");
});

module.exports = router;
