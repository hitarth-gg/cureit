const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");
router.post("/", async (req, res) => {
  const {
    userId,
    specialization,
    experience,
    hospital,
    available_from,
    available_to,
  } = req.body;
  const { data, error } = await supabase
    .from("doctors")
    .insert([
      {
        user_id: userId,
        specialization: specialization,
        experience_years: experience,
        hospital_name: hospital,
        available_from: available_from,
        available_to: available_to,
      },
    ])
    .select("*")
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data[0]);
  console.log("Doctor added successfully");
});

router.put("/:Id", async (req, res) => {
  const Id = req.params.Id;
  const { specialization, experience, hospital, available_from, available_to } =
    req.body;
  const { data, error } = await supabase
    .from("doctors")
    .update({
      specialization: specialization,
      experience_years: experience,
      hospital_name: hospital,
      available_from: available_from,
      available_to: available_to,
    })
    .eq("id", Id)
    .select("*")
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data[0]);
  console.log("Doctor updated successfully");
});

router.get("/availableSlots/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("userId: ", userId);
  const { data, error } = await supabase
    .from("appointments")
    .delete()
    .eq("patient_id", userId)
    .eq("book_status", "pending");
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  const { specialization, date } = req.query;
  console.log(specialization);
  console.log(date);
  try {
    const { data: doctors, error: doctorsError } = await supabase
      .from("doctors")
      .select("*")
      .eq("specialization", specialization);
    if (doctorsError) {
      return res.status(400).json({ error: doctorsError.message });
    }
    console.log("doctors:");
    console.log(doctors);
    const doctorsWithAppointments = await Promise.all(
      doctors.map(async (doctor) => {
        const { data: appointments, error: appointmentsError } = await supabase
          .from("appointments")
          .select("*")
          .eq("doctor_id", doctor.id)
          .in("book_status", ["pending", "completed"])
          .eq("appointment_date", date);
          

        if (appointmentsError) {
          throw new Error(appointmentsError.message);
        }

        const { data: name, error: nameError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", doctor.id)
          .select("name")
          .single();
        if (nameError) {
          throw new Error(nameError.message);
        }
        console.log(name);
        console.log(appointments);
        if (appointments.length < doctor.max_appointments) {
          const { data: appointmentPending, error: appointmentPendingError } =
            await supabase
              .from("appointments")
              .insert([
                {
                  patient_id: userId,
                  doctor_id: doctor.id,
                  appointment_date: date,
                  book_status: "pending",
                },
              ])
              .select("*")
              .single();
          if (appointmentPendingError) {
            console.log(appointmentPendingError);
            throw new Error(appointmentPendingError.message);
          }

          return {
            ...doctor,
            appointmentCount: appointments.length,
            name: name.name,
          };
        }
      })
    );
    console.log("doctorsWithAppointments:");
    console.log(doctorsWithAppointments);
    return res.status(200).json(doctorsWithAppointments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/availableSlots2/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("userId: ", userId);
  const { specialization, date, mode, sort } = req.query; // mode: 'online' or 'offline', sort: 'earliest' or 'most_available'
  console.log(specialization, date, mode, sort);
  const {data , error:DeletePendingAppointmentsError} = await supabase.from('appointments').delete().eq('patient_id' , userId).eq('book_status', 'pending');
  if(DeletePendingAppointmentsError){
    return res.status(400).json({error: DeletePendingAppointmentsError.message});
  }
   const weekday = (new Date(date).toLocaleString("en-US", { weekday: "long" })).charAt(0).toUpperCase() + (new Date(date).toLocaleString("en-US", { weekday: "long" })).slice(1);
   console.log(weekday);
  const {data:availableSlots , error:availableSlotsError} = await supabase.rpc("get_available_slots_by_earliest2", {
    p_specialization: specialization,
    p_date: date,
    p_mode: mode,
    p_weekday: weekday,});
  if(availableSlotsError){
    return res.status(400).json({error: availableSlotsError.message});
  }
  console.log(availableSlots);
  return res.status(200).json(availableSlots);
});

router.get("/calcBefore/:doctorId", async (req, res) => {
  const { doctorId } = req.params;
  console.log(doctorId);
  const { date, createdTime } = req.body;
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("appointment_date", date)
    .eq("book_status", "completed")
    .filter("created_at", "lt", createdTime);
  if (appointmentsError) {
    return res.status(400).json({ error: appointmentsError.message });
  }
  const count = appointments.length;
  return res.status(200).json(count);
});

// router.get("/doctorDetailsById/:Id" , async (req , res)=>{
//   const {Id}  = req.params;
//   console.log(Id);
//   const {data , error} = await supabase.from('doctors').select('*').eq('id' , Id);
//   if(error){
//     console.log(error);
//     return res.status(400).json({error: error.message});
//   }
//   res.json(data);
// })
router.get("/doctorDetailsById/:Id", async (req, res) => {
  const { Id } = req.params;

  // Validate UUID format before querying
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!uuidRegex.test(Id)) {
    return res.status(400).json({ error: "Invalid UUID format" });
  }

  console.log("Fetching doctor with ID:", Id);
  const {data: profiledata , error: profileerror} = await supabase.from("profiles").select("*").eq("id", Id).single();
  if (profileerror) {
    console.error("Supabase error:", profileerror);
    return res.status(400).json({ error: profileerror.message });
  }
  console.log("profiledata:");
  console.log(profiledata);
  const { data, error } = await supabase
    .from("doctors2")
    .select("*")
    .eq("id", Id)
    .single(); 
  if(error){
    console.log(error);
    return res.status(400).json({error: error.message});
  }

  const {data: hospitalData , error: hospitalDataError} = await supabase .from("reception").select("*").eq("id" , data.reception_id).single();
  
  if (hospitalDataError) {
    console.error("Supabase error:", hospitalDataError);
    return res.status(400).json({ error: hospitalDataError.message });
  }
  console.log("hospitalData:");
  console.log(hospitalData);
  data.name=profiledata.name;
  data.hospitalData = hospitalData;
  console.log(data);
  res.json(data);
});

module.exports = router;
