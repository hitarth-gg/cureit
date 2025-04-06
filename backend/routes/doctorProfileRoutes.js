const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const verifyToken = require("../config/verifyToken");
const { getCache, setCache } = require("../config/redisClient");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
router.get("/getDoctorDetailsById/:userId", verifyToken, async (req, res) => {
  try {
    console.time("API Call Time");
    console.log("Request body:", req.params);

    const userId = req.params.userId; // Corrected destructuring
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("Fetching details for userId:", userId);

    const dataDetails = await getCache(`doctorProfileDetails:${userId}`);
    if (dataDetails) {
      const parsedData = JSON.parse(dataDetails);
      console.log("Returning cached data:", dataDetails);
      console.timeEnd("API Call Time");
      return res.json(parsedData); // Return cached data
    }

    const { data: profile, error: profileError } = await supabase
      .from("doctors2")
      .select("*")
      .eq("id", userId)
      .single();
    const { data: profiles, error: profileError2 } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    console.log(profiles);
    if (profileError) {
      console.error("Supabase error:", profileError.message);
      return res
        .status(500)
        .json({ error: "Profile fetch failed", details: profileError.message });
    }
    const data1 = { profile, profiles };
    // console.log({ profile, profiles });
    var data = console.timeEnd("API Call Time");
    setCache(
      //setting cache in redis for 3 days
      `doctorProfileDetails:${userId}`,
      JSON.stringify(data1),
      259200000
    );
    return res.json({ profile, profiles });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/download/:doctorId", verifyToken, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const date = new Date().toISOString().split("T")[0];

    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments2")
      .select(
        `
    id,
    status,
    appointment_date,
    personal_details,
    doctors:doctors (specialization)
  `
      )
      .eq("doctor_id", doctorId)
      .eq("appointment_date", date)
      .eq("book_status", "completed")
      .eq("chosen_slot->>mode", "offline");
    const { data: appointments2, error: appointments2Error } = await supabase
      .from("appointments2")
      .select(
        `
  id,
  status,
  appointment_date,
  personal_details,
  doctors:doctors (specialization)
`
      )
      .eq("doctor_id", doctorId)
      .eq("appointment_date", date)
      .eq("book_status", "completed")
      .eq("chosen_slot->>mode", "online");
    console.log(appointments2.length);

    const { data: doctor_details, error: doctorError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", doctorId);
    // console.log(appointments2);
    const doctor = doctor_details?.[0] || {};
    console.log(doctor);
    if (appointmentsError) {
      return res.status(400).json({ error: appointmentsError.message });
    }

    if (appointments.length === 0 && appointments2.length === 0) {
      return res
        .status(404)
        .json({ error: "No appointments found for today." });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`OfflAppts - ${date}`);
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Patient Name", key: "name", width: 20 },
      { header: "Patient Address", key: "address", width: 20 },
      { header: "Patient Gender", key: "gender", width: 20 },
      { header: "Patient Age", key: "age", width: 20 },
      { header: "status", key: "status", width: 20 },
      { header: "Doctor", key: "doctor_name", width: 20 },
      { header: "Doctor_specialization", key: "specialization", width: 20 },
    ];
    const formattedData = appointments.map((appointment) => ({
      id: appointment.id,
      name: appointment.personal_details?.name || "N/A",
      address: appointment.personal_details?.address || "N/A",
      gender: appointment.personal_details?.gender || "N/A",
      age: appointment.personal_details?.age || "N/A",
      status: appointment.status || "N/A",
      doctor_name: doctor.name || "N/A",
      specialization: appointment.doctors.specialization || "N/A",
    }));

    worksheet.addRows(formattedData);
    const worksheet2 = workbook.addWorksheet(`OnlAppts - ${date}`);
    worksheet2.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Patient Name", key: "name", width: 20 },
      { header: "Patient Address", key: "address", width: 20 },
      { header: "Patient Gender", key: "gender", width: 20 },
      { header: "Patient Age", key: "age", width: 20 },
      { header: "status", key: "status", width: 20 },
      { header: "Doctor", key: "doctor_name", width: 20 },
      { header: "Doctor_specialization", key: "specialization", width: 20 },
    ];

    const formattedData2 = appointments2.map((appointment) => ({
      id: appointment.id,
      name: appointment.personal_details?.name || "N/A",
      address: appointment.personal_details?.address || "N/A",
      gender: appointment.personal_details?.gender || "N/A",
      age: appointment.personal_details?.age || "N/A",
      status: appointment.status || "N/A",
      doctor_name: doctor.name || "N/A",
      specialization: appointment.doctors.specialization || "N/A",
    }));

    worksheet2.addRows(formattedData2);

    const fileName = `appointments-${date}.xlsx`;
    const filePath = path.join(process.cwd(), fileName); // Use process.cwd() for reliability

    await workbook.xlsx.writeFile(filePath);

    // Send file for download
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error downloading file.");
      }

      // Optional: Delete file after download
      setTimeout(() => fs.unlinkSync(filePath), 5000);
    });
  } catch (error) {
    console.error("Error exporting appointments:", error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
