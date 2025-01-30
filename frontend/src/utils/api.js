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
  // let data = await fetch(
  //   "https://zenshin-supabase-api.onrender.com/mappings?anilist_id=21",
  // );
  // data = await data.json();
  // console.log(doctorType);
  // console.log(data);

  // return { doctor: "Ramesh Bajpai" };

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
