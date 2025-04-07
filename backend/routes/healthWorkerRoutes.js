
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const supabase = require("../config/supabaseClient");

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else
    cb(new Error("Invalid file type. Only JPG, PNG, and PDF allowed."), false);
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
      // 1) Extract text fields
      const campData = { ...req.body };

      // 2) Process file uploads
      const fileFields = [
        "campImages",
        "policePermission",
        "localAuthPermission",
        "otherDocuments",
      ];
      for (const field of fileFields) {
        if (req.files[field]?.length) {
          const file = req.files[field][0];
          const buffer = fs.readFileSync(file.path);
          const uniqueName = `${uuidv4()}-${file.filename}`;

          // upload
          const { error: upErr } = await supabase.storage
            .from("camps")
            .upload(`camps/${uniqueName}`, buffer, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.mimetype,
            });
          if (upErr) throw upErr;

          // get URL
          const { data: urlData, error: urlErr } = await supabase.storage
            .from("camps")
            .getPublicUrl(`camps/${uniqueName}`);
          if (urlErr) throw urlErr;

          campData[field] = urlData.publicUrl;
          fs.unlinkSync(file.path);
        }
      }

      // 3) Parse JSON array fields
      if (
        campData.medicalServices &&
        typeof campData.medicalServices === "string"
      ) {
        campData.medicalServices = JSON.parse(campData.medicalServices);
      }

      // 4) SANITIZE numeric fields
      Object.keys(campData).forEach((key) => {
        const val = campData[key];
        if (val === "") {
          campData[key] = null;
        } else if (typeof val === "string" && !isNaN(val)) {
          campData[key] = Number(val);
        }
      });

      // 5) DEBUG: warn on any remaining non-number in float columns
      const floatCols = [
        "latitude",
        "longitude",
        "temperature",
        "height",
        "weight",
      ];
      floatCols.forEach((col) => {
        if (campData[col] != null && typeof campData[col] !== "number") {
          console.warn(`Field ${col} is not a number:`, campData[col]);
        }
      });

      // 6) Insert into Supabase
      const { data, error } = await supabase.from("camps").insert([campData]);
      if (error) throw error;

      res.status(201).json({
        message: "Camp data received and stored successfully",
        data,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
