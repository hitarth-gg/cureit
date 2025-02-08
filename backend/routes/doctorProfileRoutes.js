const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
const verifyToken = require("../config/verifyToken");
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
    console.log("Request body:", req.params);
    const userId = req.params.userId; // Corrected destructuring
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("Fetching details for userId:", userId);

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
    // console.log({ profile, profiles });

    return res.json({ profile, profiles });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
