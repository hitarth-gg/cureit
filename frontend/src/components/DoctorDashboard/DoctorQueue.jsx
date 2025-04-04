import { toast } from "sonner";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import useGetQueueForDoctor from "../../hooks/useGetQueueForDoctor";
import DoctorQueueCard from "./DoctorQueueCard";
import { useAuthContext } from "../../utils/ContextProvider";

function DoctorQueue() {
  const user = useAuthContext();
  const [doctorId, setDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableOnlineSlots, setAvailableOnlineSlots] = useState([]);
  const [availableOfflineSlots, setAvailableOfflineSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    if (user.currentUser != null) {
      setDoctorId(user.currentUser.id);
    }
  }, [user]);

  const slotsData = {
    Friday: {
      online: [
        { end_time: "09:30", start_time: "08:00", max_appointments: 3 },
      ],
      offline: [
        { end_time: "18:00", start_time: "15:00", max_appointments: 5 },
      ],
    },
    Monday: {
      online: [
        { end_time: "12:00", start_time: "09:00", max_appointments: 5 },
        { end_time: "16:00", start_time: "14:00", max_appointments: 3 },
      ],
      offline: [
        { end_time: "12:00", start_time: "10:00", max_appointments: 4 },
      ],
    },
    Sunday: {
      offline: [
        { end_time: "13:00", start_time: "10:00", max_appointments: 4 },
      ],
    },
    Tuesday: {
      online: [
        { end_time: "10:00", start_time: "08:00", max_appointments: 4 },
      ],
      offline: [
        { end_time: "15:00", start_time: "13:00", max_appointments: 3 },
      ],
    },
    Saturday: {
      online: [
        { end_time: "09:00", start_time: "07:00", max_appointments: 4 },
      ],
    },
    Thursday: {
      online: [
        { end_time: "12:30", start_time: "10:00", max_appointments: 4 },
      ],
    },
    Wednesday: {
      online: [
        { end_time: "11:30", start_time: "09:30", max_appointments: 6 },
      ],
      offline: [
        { end_time: "17:00", start_time: "14:00", max_appointments: 5 },
      ],
    },
  };

  useEffect(() => {
    if (selectedDate) {
      const dayName = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
      }).format(selectedDate);
      if (slotsData[dayName]) {
        setAvailableOnlineSlots(slotsData[dayName]["online"] || []);
        setAvailableOfflineSlots(slotsData[dayName]["offline"] || []);
      } else {
        setAvailableOnlineSlots([]);
        setAvailableOfflineSlots([]);
      }
    }
  }, [selectedDate]);

  const { isLoading, data, error, status, refetch, isFetching } = useGetQueueForDoctor(doctorId, selectedDate, selectedSlot);

  if (error) {
    toast.error("Error fetching data");
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {(isLoading || isFetching) && <Loader />}
      <div className="mb-6 flex items-center gap-x-4">
        <input
          className="w-44 rounded-md border border-gray-300 p-2 text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>
      <div className="flex gap-8">
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Online Slots
          </h3>
          {availableOnlineSlots.length > 0 ? (
            availableOnlineSlots.map((slot, index) => (
              <button
                key={index}
                className={`block w-full text-left p-3 rounded-lg mb-2 border transition duration-200 ease-in-out ${
                  selectedSlot === slot
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100"
                }`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot.start_time} - {slot.end_time} (
                {slot.max_appointments} max appointments)
              </button>
            ))
          ) : (
            <p className="text-gray-500">
              No online slots available for the selected date.
            </p>
          )}
        </div>
        <div className="w-1/2 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            Offline Slots
          </h3>
          {availableOfflineSlots.length > 0 ? (
            availableOfflineSlots.map((slot, index) => (
              <button
                key={index}
                className={`block w-full text-left p-3 rounded-lg mb-2 border transition duration-200 ease-in-out ${
                  selectedSlot === slot
                    ? "bg-green-500 text-white"
                    : "hover:bg-green-100"
                }`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot.start_time} - {slot.end_time} (
                {slot.max_appointments} max appointments)
              </button>
            ))
          ) : (
            <p className="text-gray-500">
              No offline slots available for the selected date.
            </p>
          )}
        </div>
      </div>
      <div className="mt-6">
        {data?.map((queue, ix) => (
          <DoctorQueueCard key={ix} data={queue} refetch={refetch} />
        ))}
        {data?.length === 0 && (
          <div className="text-center text-gray-500">
            No appointments to show!
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorQueue;
