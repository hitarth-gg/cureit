import DoctorSlotCard from "./DoctorSlotCard";

function BookingFormSelectSlots({ doctors, formData, setFormData }) {
  return (
    <div>
      <div className="animate-fade">
        <div className="mb-4 flex select-none justify-center text-center font-noto text-base font-semibold md:text-lg">
          Select a doctor and time slot
        </div>

        <div className="flex flex-col gap-y-4">
          {doctors?.map((doctor, ix) => (
            <DoctorSlotCard key={ix} data={doctor} formData={formData} setFormData={setFormData} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookingFormSelectSlots;
