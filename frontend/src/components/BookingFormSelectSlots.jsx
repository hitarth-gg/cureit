import DoctorSlotCard from "./DoctorSlotCard";
// import "rsuite/dist/rsuite.min.css";

function BookingFormSelectSlots({ doctors, formData, setFormData }) {
  return (
    <div>
      <div className="animate-fade">
        <div className="mb-4 flex select-none justify-center text-center font-noto text-base font-semibold md:text-lg">
          Select a doctor and time slot
        </div>

        <input
          className="w-40 mb-4 rounded-md border border-gray-300 p-2"
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
