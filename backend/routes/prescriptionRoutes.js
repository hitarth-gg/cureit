// routes/prescriptionRoutes.js
const express = require('express');
const router = express.Router();
// const Prescription = require('../models/prescription');
const supabase = require('../config/supabaseClient');
// Generate a prescription
router.post('/generate', async (req, res) => {
  const { appointmentId, medicines, doctorNotes } = req.body;
  const {data , error} = await supabase.from('prescriptions').insert([
    {
      appointment_id: appointmentId,
      medicines: medicines,
      doctor_notes: doctorNotes
    }
  ]).select('*').single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data[0]);
  console.log('Prescription generated successfully');
});

// Fetch prescriptions by appointment ID
router.get('/:appointmentId', async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const prescription = await Prescription.findOne({ appointmentId });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found.' });
    }

    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
