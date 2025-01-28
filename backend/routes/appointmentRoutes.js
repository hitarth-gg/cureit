// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
// const Appointment = require("../models/appointment");
const supabase = require("../config/supabaseClient");
router.post("/book", async (req, res) => {
  const { patientId, doctorId , appointmentTime, reason, status } = req.body;
  const {data , error } = await supabase.from('appointments').insert([
    {
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_date: appointmentTime,
      reason: reason,
      status: status
    }
  ]).select('*').single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(201).json(data[0]);
  console.log("Appointment booked successfully");
});

// Cancel an appointment
router.post("/cancel", async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    // Release the slot
    await Slot.findByIdAndUpdate(appointment.timeSlot, { status: "available" });

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Fetch appointments by patient ID
router.get("/patient/:patientId", async (req, res) => {
  const { patientId } = req.params;
  const {data , error} = await supabase.from('appointments').select('*').eq('patient_id', patientId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);

});

// Fetch appointments by doctor ID
router.get("/doctor/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const {data , error} = await supabase.from('appointments').select('*').eq('doctor_id', doctorId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});
//update appointment status
router.post("/updateStatus", async (req, res) => {
  const { appointmentId, status } = req.body;
  console.log(req);
  const {data , error} = await supabase.from('appointments').update({status: status}).eq('id', appointmentId).select('*').single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
  console.log("Appointment status updated successfully");
});
module.exports = router;
