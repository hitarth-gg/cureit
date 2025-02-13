
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

router.post("/add/:id", async (req, res) => {
  const { id } = req.params;
  console.log("body: ", req.body)
  const { feedback, doctorId } = req.body;
  const tags = ["useless", "fraud"];
  const { data: currentTags, error: currentTagsError } = await supabase.from('doctors').select('tags').eq('id', doctorId).single();
  if (currentTagsError) {
    return res.status(400).json({ error: currentTagsError.message });
  }
  console.log("Current tags: ", currentTags);
  let tagMap = currentTags?.tags || {};
  tags.forEach((tag) => {
    tagMap[tag] = (tagMap[tag] || 0) + 1;
  });
  const { data: updateDoctor, error: updatDoctorError } = await supabase.from('doctors').update({ tags: tagMap }).eq('id', doctorId).select('*').single();
  if (updatDoctorError) {
    return res.status(400).json({ error: updatDoctorError.message });
  }
  const { data, error } = await supabase.from('feedback').insert([
    {
      appointment_id: id,
      message: feedback
    }
  ]).select('*').single();
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log("Feedback added successfully");
  return res.status(201).json(data);
});

module.exports = router;