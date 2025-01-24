// models/Prescription.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String,
    },
  ],
  doctorNotes: String,
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
