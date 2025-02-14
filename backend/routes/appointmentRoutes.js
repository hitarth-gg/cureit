// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
// const Appointment = require("../models/appointment");
const supabase = require("../config/supabaseClient");
const sendEmail = require("../services/emailService");

const getQueuePosition = async (doctorId, timestamp, date) => {
  const { data, error } = await supabase
    .from("appointments")
    .select("id")
    .eq("doctor_id", doctorId)
    .eq("appointment_date", date)
    .lt("created_at", timestamp);
  if (error) {
    console.log("Error fetching queue position:", error);
    return -1;
  }
  return data.length + 1;
};
router.post("/book", async (req, res) => {
  const {
    patientId,
    doctorId,
    appointment_date,
    book_status,
    personal_details,
  } = req.body;
  const { data: removePending, error: removePendingError } = await supabase
    .from("appointments")
    .delete()
    .eq("patient_id", patientId)
    .eq("book_status", "pending");
  if (removePendingError) {
    return res.status(400).json({ error: removePendingError });
  }

  let parsedPersonalDetails;
  try {
    parsedPersonalDetails =
      typeof personal_details === "string"
        ? JSON.parse(personal_details)
        : personal_details;
  } catch (parseError) {
    console.error("Error parsing personal_details:", parseError);
    return res.status(400).json({ error: "Invalid personal_details format" });
  }
  const { data, error } = await supabase
    .from("appointments")
    .insert([
      {
        patient_id: patientId,
        doctor_id: doctorId,
        book_status: book_status,
        appointment_date: appointment_date,
        personal_details: parsedPersonalDetails,
      },
    ])
    .select("*")
    .single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log("Appointment booked successfully");
  //sedning booking confirmation email to patient
  const { data: patientData, error: patientError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", patientId)
    .single();
  if (patientError) {
    return res.status(400).json({ error: patientError.message });
  }
  const patientEmail = patientData.email; //"mailaryam1000@gmail.com" //
  const patientName = patientData.name;
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .logo {
            width: 120px;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #333;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            background-color: #007BFF;
            color: #ffffff;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            font-size: 14px;
            color: #777;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Appointment Confirmed!</h2>
        <p class="message">Hello <strong>${patientName}</strong>,</p>
        <p class="message">Your appointment has been successfully booked with the doctor. Please check your dashboard for more details.</p>
        <div class="footer">
            <p>If you have any questions, feel free to <a href="mailto:cureitwell@gmail.com">contact us</a>.</p>
            <p>&copy; 2025 CureIt. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

  sendEmail(patientEmail, "Appointment Confirmed - CureIt", html);

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
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.json(data);
});
router.post("/updateStatus/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.query;
  console.log(req);
  const {data , error} = await supabase.from('appointments').update({status: status, updated_at: new Date().toISOString()}).eq('id', appointmentId).select('*').single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log("Appointment status updated successfully");
  return res.json(data);
});
//fetching upcoming appointments by patient Id
router.get("/upcomingAppointments/:patientId", async (req, res) => {
  const { patientId } = req.params;
  const { date } = req.query;
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", patientId)
    .gte("appointment_date", date)
    .eq("book_status", "completed")
    .eq("status", "scheduled");
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
  return  res.json(updatedAppointments);
  
})
//fetching completed appointments by patient Id
router.get("/completedAppointments/:patientId" , async (req , res)=> {
  const {patientId} = req.params;
  const {data: appointments, error} = await supabase.from('appointments').select('*').eq('patient_id', patientId).in("status" , ["completed","missed"])
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log(appointments);
  return res.json(appointments);
})
//fetching upcoming appointments by doctor Id
router.get("/doctorUpcomingAppointments/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
    .gte("appointment_date", date)
    .eq("book_status", "completed")
    .eq("status", "scheduled");
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
  return res.json(updatedAppointments);
})
//fetching completed appointments by doctor Id
router.get("/doctorCompletedAppointments/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("status", "completed");
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log(appointments);
  return res.json(appointments);
})
//deleteAppointment
router.delete("/delete/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;
  const { data, error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", appointmentId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log("Appointment deleted successfully");
  return res.json(data);
});
module.exports = router;
