// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  timeSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' },
  followUpSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
