const axios = require("axios"); // For handling file downloads
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
      const { data: reportData, error: reportError } = await supabase
        .from("test_reports")
        .insert([
          {
            appointment_id: appointmentId,
            test_date: testDate,
            report_url: data.path,
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

// router.get("/:reportId", async (req, res) => {
//   const { reportId } = req.params;

//   try {
//     // Fetch the test report details from the database
//     const { data, error } = await supabase
//       .from("test_reports")
//       .select("*")
//       .eq("id", reportId)
//       .single();

//     if (error) {
//     console
//       return res.status(400).json({ error: error.message });
//     }
//     if (!data) {
//       return res.status(404).json({ error: "Test report not found" });
//     }
//     // Get the file URL from the database record
//     const fileUrl = data.report_url;

//     // Generate a signed URL to access the file (optional for restricted buckets)
//     const { data: signedUrlData, error: signedUrlError } = await supabase.storage
//       .from("testReports")
//       .createSignedUrl(fileUrl, 60); // 60 seconds validity

//     if (signedUrlError) {
//       return res.status(400).json({ error: signedUrlError.message });
//     }

//     const signedUrl = signedUrlData.signedUrl;

//     // Fetch the file content from the signed URL
//     const fileResponse = await axios.get(signedUrl, {
//       responseType: "arraybuffer", // Ensure the response is a binary buffer
//     });

//     // Set the appropriate headers for file download
//     res.setHeader("Content-Disposition", `attachment; filename=${fileUrl.split("/").pop()}`);
//     res.setHeader("Content-Type", fileResponse.headers["content-type"]);
//     res.status(200).send(fileResponse.data);
//   } catch (err) {
//     console.error("Error fetching the file:", err);
//     res.status(500).json({ error: "An error occurred while fetching the test report file." });
//   }
// });

module.exports = router;