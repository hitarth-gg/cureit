// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Supabase ID
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], required: true },
  medicalHistory: [
    {
      condition: String,
      date: Date,
      notes: String,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
