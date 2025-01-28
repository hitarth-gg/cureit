const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const multer = require("multer");
const upload = multer();
//pushing new test report
router.post("/upload", upload.single("file"), async (req, res) => {
    const { appointmentId, testDate } = req.body;
    const file = req.file; // File is extracted using multer
  
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    try {
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from("testReports")
        .upload(`test-reports/${appointmentId}/${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
        });
  
      if (error) {
        console.error("Error uploading file to Supabase storage:", error);
        return res.status(400).json({ error: error.message });
      }
  
      // Insert test report details into the database
      const { data: reportData, error: reportError } = await supabase
        .from("test_reports")
        .insert([
          {
            appointment_id: appointmentId,
            test_date: testDate,
            report_url: data.path, // Store the file path in the database
          },
        ])
        .select("*")
        .single();
  
      if (reportError) {
        return res.status(400).json({ error: reportError.message });
      }
  
      res.status(201).json(reportData);
      console.log("Test report uploaded successfully");
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error while uploading file" });
    }
  });

module.exports = router;