import { Button } from "@radix-ui/themes";
import DoctorSlotCard from "./DoctorSlotCard";
// import "rsuite/dist/rsuite.min.css";
import { useState, useEffect } from "react";
function BookingFormSelectSlots({doctors, formData, setFormData, refetchSlots }) {
  //  const base =import.meta.env.VITE_API_BASE_URL;
  //  //make api call to get doctors
  //  const getDoctors = async () => {
  //   const userId = "00bb0259-6a09-4151-9a86-29d475b28a7f" //logged in user's id will come here
  //    const specialization = "Cardiologist"; //ml model will predict the specialization
  //    const date = formData.selectedDate.split("-").reverse().join("-");
  //   const response = await fetch(`${base}/api/doctors/availableSlots/${userId}?specialization=${specialization}&date=${date}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await response.json();
  //   console.log(data);
  //   return data;
  //  }

  //  const [doctors, setDoctors] = useState([]);
  //   useEffect(() => {
  //   getDoctors().then((data) => setDoctors(data));
  // }, [formData.selectedDate]);


  return (
    <div>
      <div className="animate-fade">
        <div className="mb-4 flex select-none justify-center text-center font-noto text-base font-semibold md:text-lg">
          Select a doctor and time slot
        </div>

        <div className="mb-4 flex items-center gap-x-2">
          <input
            className="w-40 rounded-md border border-gray-300 p-2"
            type="date"
            value={
              formData.selectedDate
                ? formData.selectedDate.split("-").reverse().join("-") // Convert back to dd/MM/yyyy for display
                : ""
            }
            onChange={(e) => {
              const [year, month, day] = e.target.value.split("-"); // Split the yyyy-MM-dd format
              const formattedDate = `${day}-${month}-${year}`; // Reformat to dd/MM/yyyy
              setFormData({
                ...formData,
                selectedDate: formattedDate,
                selectedDoctor: null,
              });
            }}
          />
          <Button
            // onClick={() => getDoctors().then((data) => setDoctors(data))}
            onClick={() => refetchSlots()}
          > Refresh Slots</Button>
        </div>
        <div className="flex flex-col gap-y-4">
          {doctors?.map((doctor, ix) => (
            <DoctorSlotCard
              key={ix}
              data={doctor}
              formData={formData}
              setFormData={setFormData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookingFormSelectSlots;
