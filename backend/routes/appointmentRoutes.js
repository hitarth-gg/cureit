const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const sendEmail = require("../services/emailService");
const { getIo } = require("../config/socket.js");
const { calendar, event } = require("../services/meetScheduler");
const {oauth2client, loadTokens, refreshAccessToken} = require("../config/googleClient");
const getQueuePosition = async (appointmentId) => {
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments2")
    .select("doctor_id, appointment_date, chosen_slot->>start_time, chosen_slot->>end_time, created_at")
    .eq("id", appointmentId)
    .single();

  if (appointmentError || !appointment) {
    console.error("Error fetching appointment details:", appointmentError);
    return -1;
  }
  console.log("appointment: ", appointment);
  const { doctor_id, appointment_date, created_at, start_time , end_time} = appointment;
  console.log("start_time: ", start_time);
  console.log("end_time: ", end_time);
  const { data, error } = await supabase
    .from("appointments2")
    .select("id")
    .eq("doctor_id", doctor_id)
    .eq("appointment_date", appointment_date)
    .eq("chosen_slot->>start_time", start_time)
    .eq("chosen_slot->>end_time", end_time)
    .eq("status", "scheduled")
    .eq("book_status", "completed")
    .lt("created_at", created_at);
   
  if (error) {
    console.error("Error fetching queue position:", error);
    return -1;
  }

  return data.length+1;
};

router.post("/book", async (req, res) => {
  const {
    patientId,
    doctorId,
    appointment_date,
    chosen_slot,
    book_status,
    personal_details,
  } = req.body;
  
  const { data: removedData, error: removePendingError } = await supabase
    .from("appointments2")
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
  
  let parsedChosenSlot;
  try {
    parsedChosenSlot =
      typeof chosen_slot === "string"
        ? JSON.parse(chosen_slot)
        : chosen_slot;
  } catch (parseError) {
    console.error("Error parsing chosen_slot:", parseError);
    return res.status(400).json({ error: "Invalid chosen_slot format" });
  }
  
  const { data: patientData, error: patientError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", patientId)
    .single();
  
  if (patientError) {
    return res.status(400).json({ error: patientError.message });
  }
  
  let googleMeetLink = null;
  if (parsedChosenSlot.mode === "online") {
    event.start.dateTime = new Date(appointment_date + "T" + parsedChosenSlot.start_time + ":00+05:30").toISOString();
    event.end.dateTime = new Date(appointment_date + "T" + parsedChosenSlot.end_time + ":00+05:30").toISOString();
    event.attendees[0].email = patientData.email;
    loadTokens();
    try {
      const result = await calendar.events.insert({
        calendarId: 'primary',
        auth: oauth2client,
        resource: event,
        conferenceDataVersion: 1,
      });
      googleMeetLink = result.data.hangoutLink;
    } catch (err) {
      console.log("Google Meet scheduling error:", err);
      return res.status(400).json({ error: "Failed to schedule Google Meet" });
    }
  }
  
  const { data, error } = await supabase
    .from("appointments2")
    .insert([
      {
        patient_id: patientId,
        doctor_id: doctorId,
        book_status: book_status,
        appointment_date: appointment_date,
        personal_details: parsedPersonalDetails,
        chosen_slot: parsedChosenSlot,
        meeting_link: googleMeetLink,
      },
    ])
    .select("*")
    .single();
  
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  
  console.log("Appointment booked successfully");
  
  
  const patientEmail = patientData.email;
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
        .message {
            font-size: 16px;
            color: #333;
            margin-bottom: 20px;
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
        ${googleMeetLink ? `<p class="message">Your Google Meet link: <a href="${googleMeetLink}" target="_blank">Join Here</a></p>` : ""}
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
router.post("/updateStatus/:appointmentId", async (req, res) => {
  console.log("update status request recieved");
  const { appointmentId } = req.params;
  const { status } = req.query;
  console.log(req);
  const { data, error } = await supabase.from('appointments2').update({ status: status, updated_at: new Date().toISOString() }).eq('id', appointmentId).select('*').single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log("Appointment status updated successfully");
  console.log(data);
  // const { data2, err } = await supabase
  //   .from("appointments")
  //   .select("doctor_id")
  //   .eq("id", appointmentId)
  //   .single();

  // console.log(data2?.dpctor, " ", err)
  const { data: data2, error: error2 } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", data?.doctor_id);
  const { data: data3, error: error3 } = await supabase
    .from("doctors")
    .select("reception_id")
    .eq("id", data?.doctor_id);
  console.log(data2, " ", data3);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const doctorId = `${data?.doctor_id}+${data2[0]?.name}`;

  console.log(doctorId);
  console.log("reaching end");
  const receptionId = data3[0]?.reception_id;
  if (doctorId) {
    const io = getIo();
    console.log("doctor queue changed");
    io.to(receptionId).emit("doctorQueueChanged", {
      doctorId: doctorId,
      receptionIdFromSocket: data3[0]?.reception_id,
    });
  }

  return res.json(data);
});
router.get("/upcomingAppointments/:patientId", async (req, res) => {
  const { patientId } = req.params;
  const { date } = req.query;
  const { data: appointments, error } = await supabase
    .from("appointments2")
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
      const position = await getQueuePosition(appointment.id); 
      return { ...appointment, queuePosition: position };
    })
  );
  return res.json(updatedAppointments);
})
router.get("/completedAppointments/:patientId", async (req, res) => {
  const { patientId } = req.params;
  const { data: appointments, error } = await supabase.from('appointments2').select('*').eq('patient_id', patientId).in("status", ["completed", "missed"])
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log(appointments);
  return res.json(appointments);
});
router.get("/doctorUpcomingAppointments/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const { date, endTime , startTime} = req.query;
  const { data: appointments, error } = await supabase
    .from("appointments2")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("appointment_date", date)
    .eq("book_status", "completed")
    .eq("status", "scheduled")
    .eq("chosen_slot->>start_time", startTime)
    .eq("chosen_slot->>end_time", endTime);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const updatedAppointments = await Promise.all(
    appointments.map(async (appointment) => {
      const position = await getQueuePosition(appointment.id); 
      return { ...appointment, queuePosition: position };
    }))
  return res.json(updatedAppointments);
});
router.get("/doctorCompletedAppointments/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const { data: appointments, error } = await supabase
    .from("appointments2")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("status", "completed");
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log(appointments);
  return res.json(appointments);
});
router.delete("/delete/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;
  const { data, error } = await supabase
    .from("appointments2")
    .delete()
    .eq("id", appointmentId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.json(data);
});
module.exports = router;