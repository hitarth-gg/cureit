const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
// const connectDB = require("./databse/connectDB");

const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const testReportsRoutes = require("./routes/testReportsRoutes");
// connectDB();
const cors = require("cors");

// connectDB();

const app = express();
app.use(cors());

app.use(express.json());

// Routes

app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/testReports", testReportsRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
