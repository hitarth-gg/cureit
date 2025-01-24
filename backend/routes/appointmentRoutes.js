// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const Slot = require('../models/slot');
router.post('/book', async (req, res) => {
  const { patientId, slotId } = req.body;

  try {
    // Check if the slot is available
    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, status: 'available' },
      { status: 'booked' },
      { new: true }
    );

    if (!slot) {
      return res.status(400).json({ message: 'Slot is no longer available.' });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId: slot.doctorId,
      timeSlot: slot._id,
      status: 'booked',
    });

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel an appointment
router.post('/cancel', async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Release the slot
    await Slot.findByIdAndUpdate(appointment.timeSlot, { status: 'available' });

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
