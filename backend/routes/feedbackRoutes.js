
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

router.post("/add/:id" , async(req , res) => {
    const {id} = req.params;
  const {feedback} = req.body;
  const {data , error} = await supabase.from('feedback').insert([
    {
      appointment_id: id,
      message: feedback
    }
  ]).select('*').single();
  if(error)
  {
    return res.status(400).json({error: error.message});
  }
  console.log("Feedback added successfully");
  return res.status(201).json(data);
});

module.exports = router;