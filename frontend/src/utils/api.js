export async function getAddressFromCoords(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch address from coordinates.");
    }

    const data = await response.json();
    console.log(data);

    const address = data.display_name;
    if (!address) {
      throw new Error("No address found for the given coordinates.");
    }

    return address;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch address.");
  }
}

export async function getDoctorSlots(doctorType) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const testData = [
    {
      name: "Dr. Emily Carter",
      hospital: "CityCare General Hospital",
      specialization: "Dentist",
      available_date: "28-09-2021",
      available_time: "10:00 AM - 2:00 PM",
      uid: "1",
    },
    {
      name: "Dr. James Rodriguez",
      hospital: "Sunrise Medical Center",
      specialization: "Dentist",
      available_date: "28-09-2021",
      available_time: "9:00 AM - 1:00 PM",
      uid: "2",
    },
    {
      name: "Dr. Sophia Lee",
      hospital: "Harmony Children's Hospital",
      specialization: "Dentist",
      available_date: "28-09-2021",
      available_time: "11:00 AM - 3:00 PM",
      uid: "3",
    },
    {
      name: "Dr. Arjun Mehta",
      hospital: "Lotus Specialty Clinic",
      specialization: "Dentist",
      available_date: "01-02-2025",
      available_time: "1:00 PM - 5:00 PM",
      uid: "4",
    },
    {
      name: "Dr. Olivia Brown",
      hospital: "Green Valley Healthcare",
      specialization: "Dentist",
      available_date: "01-02-2025",
      available_time: "2:00 PM - 6:00 PM",
      uid: "5",
    },
  ];
  if (doctorType === "Dentist") return testData;
  else return null;
}
export async function getDoctorType(data) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { doctorType: "Dentist" };
}

export async function getPatientAppointments(patientId) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const today = new Date().toLocaleDateString("en-IN").replace(/\//g, "-"); // today's date in dd-mm-yyyy format
  const testData = [
    {
      doctor: "Dr. Emily Carter",
      hospital: "CityCare General Hospital",
      specialization: "Dentist",
      appointment_date: "28-09-2025",
      appointment_time: "10:00 AM - 2:00 PM",
      uid: "132",
      queuePosition: 123,
    },
    {
      doctor: "Dr. James Rodriguez",
      hospital: "Sunrise Medical Center",
      specialization: "Dentist",
      appointment_date: today,
      appointment_time: "9:00 AM - 1:00 PM",
      uid: "2",
      queuePosition: 12,
    },
    {
      doctor: "Dr. James Rodriguez",
      hospital: "Sunrise Medical Center",
      specialization: "Dentist",
      appointment_date: today,
      appointment_time: "9:00 AM - 1:00 PM",
      uid: "2",
      queuePosition: 46,
    },
    {
      doctor: "Dr. Sophia Lee",
      hospital: "Harmony Children's Hospital",
      specialization: "Dentist",
      appointment_date: "28-09-2025",
      appointment_time: "11:00 AM - 3:00 PM",
      uid: "3",
      queuePosition: 141,
    },
    {
      doctor: "Dr. Ratiram Lee",
      hospital: "Harmony Children's Hospital",
      specialization: "Dentist",
      appointment_date: "28-09-2025",
      appointment_time: "11:00 AM - 3:00 PM",
      uid: "3",
      queuePosition: 1123,
    },
  ];
  return testData;
}

export async function getPatientAppointmentHistory() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const testData = [
    {
      doctor: "Dr. Emily Carter",
      hospital: "CityCare General Hospital",
      specialization: "Dentist",
      appointment_date: "28-01-2025",
      appointment_time: "10:00 AM - 2:00 PM",
      uid: "132",
    },
    {
      doctor: "Dr. James Rodriguez",
      hospital: "Sunrise Medical Center",
      specialization: "Dentist",
      appointment_date: "28-01-2025",
      appointment_time: "9:00 AM - 1:00 PM",
      uid: "2",
    },
    {
      doctor: "Dr. Sophia Lee",
      hospital: "Harmony Children's Hospital",
      specialization: "Dentist",
      appointment_date: "28-01-2025",
      appointment_time: "11:00 AM - 3:00 PM",
      uid: "3",
    },
  ];
  return testData;
}

export async function getQueueForDoctor(doctorId) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const testData = [
    {
      patiendId: 1,
      patientName: "John Doe",
      age: 25,
      gender: "Male",
      issue: "Toothache",
      issueDetails:
        "I have a severe toothache since last night. My gums are swollen and I can't eat anything. My gums feel puffy and tender, especially around certain teeth. They look red and swollen, and sometimes they even bleed a little when I brush or floss. It feels sore, and chewing can be uncomfortable.",
      currentMedication: "Crocin 500mg, Budamate 200mg",
      appointment_date: "28-09-2025",
      appointment_time: "10:00 AM - 2:00 PM",
      hospital: "CityCare General Hospital",
      uid: "132",
      queuePosition: 123,
    },
    {
      patiendId: 2,
      patientName: "Jane Doe",
      age: 25,
      gender: "Male",
      issue: "Toothache",
      issueDetails:
        "I have a severe toothache since last night. My gums are swollen and I can't eat anything. My gums feel puffy and tender, especially around certain teeth. They look red and swollen, and sometimes they even bleed a little when I brush or floss. It feels sore, and chewing can be uncomfortable.",
      currentMedication: "Crocin 500mg, Budamate 200mg",
      appointment_date: "28-09-2025",
      appointment_time: "9:00 AM - 1:00 PM",
      hospital: "CityCare General Hospital",
      uid: "2",
      queuePosition: 3,
    },
    {
      patiendId: 1,
      patientName: "John Doe",
      age: 25,
      gender: "Male",
      issue: "Toothache",
      issueDetails:
        "I have a severe toothache since last night. My gums are swollen and I can't eat anything. My gums feel puffy and tender, especially around certain teeth. They look red and swollen, and sometimes they even bleed a little when I brush or floss. It feels sore, and chewing can be uncomfortable.",
      currentMedication: "Crocin 500mg, Budamate 200mg",
      appointment_date: "28-09-2025",
      appointment_time: "11:00 AM - 3:00 PM",
      hospital: "CityCare General Hospital",
      uid: "3",
      queuePosition: 141,
    },
  ];
  return testData;
}
