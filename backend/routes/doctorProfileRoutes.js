const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const verifyToken = require("../config/verifyToken");
const { getCache, setCache } = require("../config/redisClient");
/*
name: "Dr. Amit Mishra",
email: "amitmishra@email.com",
phone: "+91 9827593710",
address: "Sector 24, Aliganj, Lucknow, India",
profileImage: "",
age: 25,
gender: "Male",
specialization: "Cardiologist",
uid: 234,
*/
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
      .from("doctors")
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

module.exports = router;
