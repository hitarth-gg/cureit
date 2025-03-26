const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
// const https = require("https");
const http = require("http");

dotenv.config();
require("./services/cronJob.js");
const { redis, setCache, getCache } = require("./config/redisClient.js");
const { initSocket } = require("./config/socket"); // import your socket module

const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const testReportsRoutes = require("./routes/testReportsRoutes");
const doctorProfileRoutes = require("./routes/doctorProfileRoutes");
const receptionProfileRoutes = require("./routes/receptionProfileRoutes.js");
const feedbackRoutes = require("./routes/feedbackRoutes");
// connectDB();
const profileRoutes = require("./routes/profileRoutes");
const multiDoctorDashboardRoutes = require("./routes/multiDoctorDashboardRoutes");

const cors = require("cors");

// connectDB();

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors());

app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Hello World"));

app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/testReports", testReportsRoutes);
app.use("/api/uploadProfiles", profileRoutes);
app.use("/api/doctorProfileRoutes", doctorProfileRoutes);
app.use("/api/receptionProfileRoutes", receptionProfileRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/multiDoctorDashboardRoutes", multiDoctorDashboardRoutes);
// const options = {
//   key: fs.readFileSync("certs/key.pem"),
//   cert: fs.readFileSync("certs/cert.pem"),
// };
app.get("/keepalive", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

(async () => {
  await setCache("go", "goa");
  const value = await getCache("go");
  console.log("Cached value:", value);
})();

const PORT = process.env.PORT || 8000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);

// https.createServer(options, app).listen(PORT, "0.0.0.0", () => {
//   console.log(`Server is running on https://localhost:${PORT}`);
// });
