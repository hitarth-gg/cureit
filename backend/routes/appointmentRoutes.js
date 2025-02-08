// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
// const Appointment = require("../models/appointment");
const supabase = require("../config/supabaseClient");
const sendEmail = require("../services/emailService");

const getQueuePosition = async (doctorId , timestamp, date) => {
  const {data , error} = await supabase.from('appointments').select('id').eq('doctor_id', doctorId).eq('appointment_date' , date).lt('created_at', timestamp);
  if (error) {
    console.log("Error fetching queue position:", error);
    return -1;
  }
  return data.length+1;

}
router.post("/book", async (req, res) => {
  const { patientId, doctorId , appointment_date, book_status, personal_details,} = req.body;
  const {data: removePending , error: removePendingError} = await supabase.from('appointments').delete().eq('patient_id', patientId).eq('book_status', 'pending');
  if (removePendingError) {
    return res.status(400).json({ error: removePendingError
    });
  }

  let parsedPersonalDetails;
    try {
      parsedPersonalDetails = typeof personal_details === "string" ? JSON.parse(personal_details) : personal_details;
    } catch (parseError) {
      console.error("Error parsing personal_details:", parseError);
      return res.status(400).json({ error: "Invalid personal_details format" });
    }
  const {data , error } = await supabase.from('appointments').insert([
    {
      patient_id: patientId,
      doctor_id: doctorId,
      book_status: book_status,
      appointment_date: appointment_date,
      personal_details: parsedPersonalDetails,
    }
  ]).select('*').single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log("Appointment booked successfully");
  //sedning booking confirmation email to patient
  const {data: patientData, error: patientError} = await supabase.from('profiles').select('*').eq('id', patientId).single();
  if (patientError) {
    return res.status(400).json({ error: patientError.message });
  }
  const patientEmail = patientData.email; //"mailaryam1000@gmail.com" //
  const patientName = patientData.name;
  sendEmail(patientEmail, "Appointment Booked", `Hello ${patientName}, Your appointment has been successfully booked with the doctor. Please check your dashboard for more details.`);

  return res.status(201).json(data); 
});
// //Fetch upcoming appointments by patient ID
// router.get("/patient/:patientId", async (req, res) => {
//   const { patientId } = req.params;
//   const {data , error} = await supabase.from('appointments').select('*').eq('patient_id', patientId).eq('book_status' , "pending");
//   if (error) {
//     return res.status(400).json({ error: error.message });
//   }
//   res.json(data);
// });
// //Fetch completed appointments by patient ID
// router.get("/patient/:patientId", async (req, res) => {
//   const { patientId } = req.params;
//   const {data , error} = await supabase.from('appointments').select('*').eq('patient_id', patientId).eq('book_status' , "completed");
//   if (error) {
//     return res.status(400).json({ error: error.message });
//   }
//   res.json(data);
// });
router.get("/doctor/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const {data , error} = await supabase.from('appointments').select('*').eq('doctor_id', doctorId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});
router.post("/updateStatus/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.query;
  console.log(req);
  const {data , error} = await supabase.from('appointments').update({status: status}).eq('id', appointmentId).select('*').single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
  console.log("Appointment status updated successfully");
});
//fetching upcoming appointments by patient Id
router.get("/upcomingAppointments/:patientId" , async (req, res) => {
  const {patientId} = req.params;
  const {date} = req.query;
  const {data: appointments, error} = await supabase.from('appointments').select('*').eq('patient_id', patientId).gte('appointment_date' , date).eq('book_status', "completed").eq("status" , "scheduled");
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const updatedAppointments = await Promise.all(
  appointments.map(async (appointment) => {
    const queuePosition = await getQueuePosition(appointment.doctor_id, appointment.created_at, appointment.appointment_date);
    if(queuePosition !== -1){
      console.log("appointment: ", appointment);
      console.log("Queue position:", queuePosition);
      return {...appointment, queuePosition: queuePosition};
    }
  }))
  res.json(updatedAppointments);
  
})
//fetching completed appointments by patient Id
router.get("/completedAppointments/:patientId" , async (req , res)=> {
  const {patientId} = req.params;
  const {data: appointments, error} = await supabase.from('appointments').select('*').eq('patient_id', patientId).eq("status" , "completed")
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log(appointments);
  res.json(appointments);
})
//fetching upcoming appointments by doctor Id
router.get("/doctorUpcomingAppointments/:doctorId" , async (req, res) => {
  const {doctorId} = req.params;
  const {date} = req.query;
  const {data: appointments, error} = await supabase.from('appointments').select('*').eq('doctor_id', doctorId).gte('appointment_date' , date).eq('book_status', "completed").eq("status" , "scheduled");
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const updatedAppointments = await Promise.all(
  appointments.map(async (appointment) => {
    const queuePosition = await getQueuePosition(appointment.doctor_id, appointment.created_at, appointment.appointment_date);
    if(queuePosition !== -1){
      console.log("appointment: ", appointment);
      console.log("Queue position:", queuePosition);
      return {...appointment, queuePosition: queuePosition};
    }
  }))
  res.json(updatedAppointments);
})
//fetching completed appointments by doctor Id
router.get("/doctorCompletedAppointments/:doctorId" , async (req , res)=> {
  const {doctorId} = req.params;
  const {data: appointments, error} = await supabase.from('appointments').select('*').eq('doctor_id', doctorId).eq("status" , "completed")
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log(appointments);
  res.json(appointments);
})
//deleteAppointment
router.delete("/delete/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;
  const {data , error} = await supabase.from('appointments').delete().eq('id', appointmentId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
  console.log("Appointment deleted successfully");
});
module.exports = router;
