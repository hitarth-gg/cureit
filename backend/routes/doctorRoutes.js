// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor');
const Slot = require('../models/slot');

// Fetch all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('availableSlots');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new doctor
router.post('/', async (req, res) => {
  const { userId, specialization, experience } = req.body;

  try {
    const doctor = await Doctor.create({
      userId,
      specialization,
      experience,
    });

    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add slots for a doctor
router.post('/:doctorId/slots', async (req, res) => {
  const { doctorId } = req.params;
  const { date, time } = req.body;

  try {
    const slot = await Slot.create({
      doctorId,
      date,
      time,
      status: 'available',
    });

    // Update doctor's available slots
    await Doctor.findByIdAndUpdate(doctorId, { $push: { availableSlots: slot._id } });

    res.status(201).json(slot);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
