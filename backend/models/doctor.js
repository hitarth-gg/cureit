// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Linked to User Model
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  availableSlots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }],
  rating: { type: Number, default: 0 },
});

module.exports = mongoose.model('Doctor', doctorSchema);
