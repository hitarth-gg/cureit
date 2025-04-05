// routes/appointmentRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// const Appointment = require("../models/appointment");
const supabase = require("../config/supabaseClient");
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer to store files locally first and preserve original extensions.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Filter for valid file types (JPG, PNG, PDF)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, PNG, and PDF files are allowed."),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

router.post(
  "/healthCampRegistration",
  upload.fields([
    { name: "campImages", maxCount: 1 },
    { name: "policePermission", maxCount: 1 },
    { name: "localAuthPermission", maxCount: 1 },
    { name: "otherDocuments", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Extract text fields from form data.
      const campData = { ...req.body };

      // List of file fields to process.
      const fileFields = [
        "campImages",
        "policePermission",
        "localAuthPermission",
        "otherDocuments",
      ];

      for (const field of fileFields) {
        if (req.files[field] && req.files[field].length > 0) {
          const file = req.files[field][0];
          // Read the file as a binary buffer.
          const fileBuffer = fs.readFileSync(file.path);
          const uniqueFilename = `${uuidv4()}-${file.filename}`;

          // Upload the file to Supabase Storage while preserving the original MIME type.
          const { data: storageData, error: storageError } =
            await supabase.storage
              .from("camps") // replace with your bucket name
              .upload(`camps/${uniqueFilename}`, fileBuffer, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.mimetype, // preserves original MIME type
              });

          if (storageError) {
            throw new Error(
              `Failed to upload ${field}: ${storageError.message}`
            );
          }

          // Generate a public URL for the uploaded file.
          const { data: publicUrlData, error: publicUrlError } =
            supabase.storage
              .from("camps")
              .getPublicUrl(`camps/${uniqueFilename}`);

          if (publicUrlError) {
            throw new Error(
              `Error generating public URL for ${field}: ${publicUrlError.message}`
            );
          }

          // Save the public URL in the campData.
          campData[field] = publicUrlData.publicUrl;

          // Remove the file from local storage after successful upload.
          fs.unlinkSync(file.path);
        }
      }

      // Convert medicalServices from JSON string if needed.
      if (
        campData.medicalServices &&
        typeof campData.medicalServices === "string"
      ) {
        campData.medicalServices = JSON.parse(campData.medicalServices);
      }

      // Insert the camp data into your Supabase table.
      const { data, error } = await supabase.from("camps").insert([campData]);
      if (error) throw error;

      res
        .status(201)
        .json({ message: "Camp data received and stored successfully", data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/healthcheckups", async (req, res) => {
  console.log("recieve jhealth checkup data", req.body);
  try {
    // Get data from client request
    const formData = req.body;

    // Insert into Supabase table
    const { data, error } = await supabase
      .from("healthcheckups")
      .insert([formData]);

    if (error) throw error;

    res
      .status(201)
      .json({ message: "Health checkup recorded successfully", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/healthcamps", async (req, res) => {
  try {
    // Query the camps table
    const { data, error } = await supabase.from("camps").select("*");

    if (error) {
      console.error("Error fetching camps from Supabase:", error);
      return res.status(500).json({ error: "Failed to fetch health camps" });
    }

    // Return the data
    return res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Optional: Add a route to fetch a specific camp by ID
router.get("/healthcamps/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("camps")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching camp from Supabase:", error);
      return res.status(500).json({ error: "Failed to fetch health camp" });
    }

    if (!data) {
      return res.status(404).json({ error: "Health camp not found" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/doctor-volunteer", async (req, res) => {
  try {
    const { doctorId, campId, camp_start_date, camp_end_date } = req.body;

    // Check for overlapping camp dates for the same doctor.
    // This query looks for any camp where:
    //   - existing camp_start_date is on or before the new camp_end_date AND
    //   - existing camp_end_date is on or after the new camp_start_date.
    // Adjust the query if your date columns are stored in a different format.
    const { data: overlappingCamps, error: checkError } = await supabase
      .from("campsxdoctors")
      .select("*")
      .eq("doctor_id", doctorId)
      .or(
        `camp_start_date.lte.${camp_end_date},camp_end_date.gte.${camp_start_date}`
      );

    if (checkError) {
      throw checkError;
    }

    if (overlappingCamps && overlappingCamps.length > 0) {
      return res.status(400).json({
        error: "Camp dates conflict with an existing record for this doctor.",
      });
    }

    // If no overlapping camps, proceed with the insert.
    const { data, error } = await supabase.from("campsxdoctors").insert(
      [
        {
          doctor_id: doctorId,
          camp_id: campId,
          camp_start_date: camp_start_date,
          camp_end_date: camp_end_date,
        },
      ],
      { ignoreDuplicates: true }
    );

    if (error) {
      throw error;
    }

    res.status(200).json({
      message: "Record inserted or already exists",
      data,
    });
  } catch (error) {
    console.error("Insert error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});
router.get("/doctor/volunteered/:doctorId", async (req, res) => {
  const { doctorId } = req.params;

  try {
    const { data, error } = await supabase
      .from("campsxdoctors")
      .select("camp_id")
      .eq("doctor_id", doctorId);

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    // Extract just the list of camp_ids
    const campIds = data.map((item) => item.camp_id);

    res.status(200).json(campIds);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
