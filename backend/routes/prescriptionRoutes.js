// routes/prescriptionRoutes.js
const express = require('express');
const router = express.Router();
const Prescription = require('../models/prescription');

// Generate a prescription
router.post('/generate', async (req, res) => {
  const { appointmentId, medicines, doctorNotes } = req.body;

  try {
    const prescription = await Prescription.create({
      appointmentId,
      medicines,
      doctorNotes,
    });

    res.status(201).json({ message: 'Prescription generated successfully', prescription });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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
