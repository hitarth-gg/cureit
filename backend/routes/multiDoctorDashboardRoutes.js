const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const { getIo } = require("../config/socket.js");
const getQueuePosition = async (appointmentId) => {
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments2")
    .select(
      "doctor_id, appointment_date, chosen_slot->>start_time, chosen_slot->>end_time, created_at"
    )
    .eq("id", appointmentId)
    .single();

  if (appointmentError || !appointment) {
    console.error("Error fetching appointment details:", appointmentError);
    return -1;
  }
  console.log("appointment: ", appointment);
  const { doctor_id, appointment_date, created_at, start_time, end_time } =
    appointment;
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

  return data.length + 1;
};

router.get("/nextAppointments/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  const today = new Date();
  //   console.log(today.getDate() - 1);
  const date = today.toISOString().split("T")[0];

  const { data: appointments, error } = await supabase
    .from("appointments2")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("appointment_date", date)
    .eq("book_status", "completed")
    .eq("status", "scheduled")
    .eq("chosen_slot->>mode", "offline");

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  // Process each appointment to get the queue position and filter based on it.
  const updatedAppointments = await Promise.all(
    appointments.map(async (appointment) => {
      const queuePosition = await getQueuePosition(appointment.id);
      if (queuePosition !== -1 && queuePosition <= 4) {
        // console.log("appointment: ", appointment);
        // console.log("Queue position:", queuePosition);
        return { ...appointment, queuePosition };
      }
      return null;
    })
  );

  // Filter out appointments that didn't meet the criteria.
  const filteredAppointments = updatedAppointments.filter(
    (app) => app !== null
  );

  // Map the results to only return personal_details.name, queuePosition, and checked_in_status.
  const result = filteredAppointments.map((appointment) => ({
    name: appointment.personal_details.name,
    queuePosition: appointment.queuePosition,
    checked_in_status: appointment.checked_in_status,
    age: appointment.personal_details.age,
  }));

  return res.json(result);
});

router.get("/allNextAppointments/:receptionId", async (req, res) => {
  const { receptionId } = req.params;
  //   console.log(receptionId);
  const today = new Date();
  const date = today.toISOString().split("T")[0];
  const { data: receptionData, error: receptionError } = await supabase
    .from("doctors2")
    .select("id")
    .eq("reception_id", receptionId);

  if (receptionError) {
    return res.status(400).json({ error: receptionError.message });
  }

  if (!receptionData) {
    return res
      .status(404)
      .json({ error: "No doctors found for this reception" });
  }

  const doctorIds = [];
  const doctorMap = {};

  // Use Promise.all with .map to ensure all asynchronous operations complete
  await Promise.all(
    receptionData.map(async (doctor) => {
      const { data: doctorData, error: doctorError } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", doctor.id)
        .single();

      if (doctorError) {
        console.error(`Error fetching doctor ${doctor.id}:`, doctorError);
        return;
      }

      doctorMap[doctor.id] = doctorData.name;
      doctorIds.push(doctor.id);
    })
  );

  // This object will hold the final result with doctor IDs (plus name) as keys.
  const result = {};

  // 2. For each doctor, fetch their top 4 appointments.
  await Promise.all(
    doctorIds.map(async (doctorId) => {
      const { data: appointments, error } = await supabase
        .from("appointments2")
        .select("*")
        .eq("doctor_id", doctorId)
        .eq("appointment_date", date)
        .eq("book_status", "completed")
        .eq("status", "scheduled")
        .eq("chosen_slot->>mode", "offline");
      console.log(appointments);

      if (error) {
        result[`${doctorId}+${doctorMap[doctorId]}`] = [];
        console.error(
          `Error fetching appointments for doctor ${doctorId}:`,
          error
        );
        return;
      }

      // Process each appointment to calculate the queue position.
      const updatedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const queuePosition = await getQueuePosition(appointment.id);
          if (queuePosition !== -1 && queuePosition <= 4) {
            return { ...appointment, queuePosition };
          }
          return null;
        })
      );

      // Filter out appointments that did not meet the criteria.
      const filteredAppointments = updatedAppointments.filter(
        (app) => app !== null
      );

      // Map to only the required fields.
      const mappedAppointments = filteredAppointments.map((appointment) => ({
        name: appointment.personal_details.name,
        queuePosition: appointment.queuePosition,
        checked_in_status: appointment.checked_in_status,
        age: appointment.personal_details.age,
      }));

      // Store the appointments using a key that combines doctorId and doctor name.
      result[`${doctorId}+${doctorMap[doctorId]}`] = mappedAppointments;
    })
  );

  console.log(result);
  return res.json(result);
});
// 1. Fetch the list of doctor IDs associated with the reception.
//   const { data: receptionData, error: receptionError } = await supabase
//     .from("doctors")
//     .select("id")
//     .eq("reception_id", receptionId);
//   //   console.log(receptionData);
//   if (receptionError) {
//     return res.status(400).json({ error: receptionError.message });
//   }

//   if (!receptionData) {
//     return res
//       .status(404)
//       .json({ error: "No doctors found for this reception" });
//   }

//   const doctorIds = [];
//   const doctorMap = {};

//   if (receptionData && receptionData.length > 0) {
//     receptionData.forEach(async (doctor) => {
//       const { data: doctorData, error: doctorError } = await supabase
//         .from("profiles")
//         .select("name")
//         .eq("id", doctor.id);
//       doctorMap[doctor.id] = doctorData.name;
//       doctorIds.push(doctor.id);
//     });
//   } else {
//     console.log("No doctors found for this reception.");
//   }

//   //   console.log(doctorIds);

//   // This object will hold the final result with doctor IDs as keys.
//   const result = {};

//   // 2. For each doctor, fetch their top 4 appointments.
//   await Promise.all(
//     doctorIds.map(async (doctorId) => {
//       const { data: appointments, error } = await supabase
//         .from("appointments")
//         .select("*")
//         .eq("doctor_id", doctorId)
//         .eq("appointment_date", date)
//         .eq("book_status", "completed")
//         .eq("status", "scheduled");

//       //   console.log(appointments.length);
//       if (error) {
//         // In case of an error, we store an empty list for this doctor.
//         result[doctorId] = [];
//         console.error(
//           `Error fetching appointments for doctor ${doctorId}:`,
//           error
//         );
//         return;
//       }
//       //   console.log(appointments.length);
//       // 3. Process each appointment to calculate the queue position.
//       const updatedAppointments = await Promise.all(
//         appointments.map(async (appointment) => {
//           const queuePosition = await getQueuePosition(
//             appointment.doctor_id,
//             appointment.created_at,
//             appointment.appointment_date
//           );
//           // Only include appointments with a valid queue position (<= 4).
//           //   console.log(appointment.id, " ", queuePosition);
//           if (queuePosition !== -1 && queuePosition <= 4) {
//             // console.log(queuePosition);
//             return { ...appointment, queuePosition };
//           }
//           return null;
//         })
//       );
//       //   console.log(updatedAppointments);
//       // Filter out appointments that did not meet the criteria.
//       const filteredAppointments = updatedAppointments.filter(
//         (app) => app !== null
//       );

//       // Map to only the required fields.
//       const mappedAppointments = filteredAppointments.map((appointment) => ({
//         name: appointment.personal_details.name,
//         queuePosition: appointment.queuePosition,
//         checked_in_status: appointment.checked_in_status,
//         age: appointment.personal_details.age,
//       }));

//       // Store the list of appointments in the result object using doctorId as the key.
//       result[`${doctorId}+${doctorMap[doctorId]}`] = mappedAppointments;
//     })
//   );
//   console.log(result);
//   // Return the aggregated result object.
//   return res.json(result);
// });

module.exports = router;
