import { toast } from "sonner";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import useGetQueueForDoctor from "../../hooks/useGetQueueForDoctor";
import DoctorQueueCard from "./DoctorQueueCard";
import { useAuthContext } from "../../utils/ContextProvider";
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react";

function DoctorQueue() {
  const { currentUser } = useAuthContext();
  const [doctorId, setDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableOnlineSlots, setAvailableOnlineSlots] = useState([]);
  const [availableOfflineSlots, setAvailableOfflineSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentType, setAppointmentType] = useState("all"); // all, online, offline
// Sample data for testing the DoctorQueueCard component

// Sample 1: Today's in-person appointment
const todayAppointment = [{
  patientName: "Sarah Johnson",
  patientId: "P12345678",
  age: "42",
  gender: "Female",
  hospital: "City General Hospital",
  issue: "Chronic migraine",
  issueDetails: "Patient has been experiencing frequent migraines for the past 3 months, with increased severity in the last 2 weeks.",
  appointment_time: {
    start_time: "14:30:00",
    end_time: "15:00:00",
    mode: "offline"
  },
  appointment_date: new Date().toLocaleDateString("en-IN").replace(/\//g, "-"), // Today's date in DD-MM-YYYY format
  queuePosition: "3",
  available_from: "14:00:00",
  meetingLink: "",
  appointmentId: "A98765432"
},
{
  patientName: "Raj Patel",
  patientId: "P87654321",
  age: "28",
  gender: "Male",
  hospital: "MedLife Clinic",
  issue: "Follow-up after surgery",
  issueDetails: "Post-operative follow-up after appendectomy performed 2 weeks ago. Patient reports good recovery with minimal pain.",
  appointment_time: {
    start_time: "10:15:00",
    end_time: "10:45:00",
    mode: "online"
  },
  appointment_date: (() => {
    // Tomorrow's date in DD-MM-YYYY format
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString("en-IN").replace(/\//g, "-");
  })(),
  queuePosition: "1",
  available_from: "10:00:00",
  meetingLink: "https://meet.example.com/dr-appointment/b7c9d2e3",
  appointmentId: "A12345678"
}]

// Sample 2: Future online appointment

// Usage with the DoctorQueueCard component:
// <DoctorQueueCard data={todayAppointment} refetch={() => console.log("Refetching data...")} />
// <DoctorQueueCard data={futureAppointment} refetch={() => console.log("Refetching data...")} />
  useEffect(() => {
    if (currentUser != null) {
      setDoctorId(currentUser.id);
    }
  }, [currentUser]);

  const slotsData = {
    Friday: {
      online: [
        { end_time: "09:30", start_time: "08:00", max_appointments: 3 },
        { end_time: "19:30", start_time: "20:00", max_appointments: 3 },
        { end_time: "23:30", start_time: "23:50", max_appointments: 3 },
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
      // Reset selected slot when date changes
      setSelectedSlot(null);
    }
  }, [selectedDate]);

  const { isLoading, data, error, refetch, isFetching } = useGetQueueForDoctor(doctorId, selectedDate, selectedSlot);

  useEffect(() => {
    if (error) {
      toast.error("Error fetching appointments");
    }
  }, [error]);

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const handlePrevDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    // Don't allow selecting days before today
    if (prevDay >= new Date(new Date().setHours(0, 0, 0, 0))) {
      setSelectedDate(prevDay);
    }
  };

  const formatDateForDisplay = (date) => {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const filteredData = data?.filter(appointment => {
    if (appointmentType === "all") return true;
    return appointment.type === appointmentType;
  });

  return (
    <div className=" min-h-screen rounded-lg ">
      <div className=" mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Doctor's Queue</h2>
        
        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
          {/* Date selector and filter controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handlePrevDay}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Previous day"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="flex items-center">
                  <div className="relative">
                    <input
                      className="w-44 pl-10 rounded-md border border-gray-300 p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={selectedDate.toISOString().split("T")[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    />
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  </div>
                  <span className="ml-3 text-lg font-medium text-gray-700">
                    {isToday(selectedDate) ? "Today" : formatDateForDisplay(selectedDate)}
                  </span>
                </div>
                
                <button 
                  onClick={handleNextDay}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Next day"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 mr-2">Filter:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${appointmentType === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setAppointmentType('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${appointmentType === 'online' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setAppointmentType('online')}
                  >
                    Online
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${appointmentType === 'offline' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setAppointmentType('offline')}
                  >
                    In-Person
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Time slots section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Available Time Slots</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Online slots */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 mr-2">
                    <Clock className="h-4 w-4" />
                  </div>
                  <h4 className="text-md font-medium text-gray-800">Online Consultations</h4>
                </div>
                
                <div className="space-y-2">
                  {availableOnlineSlots.length > 0 ? (
                    availableOnlineSlots.map((slot, index) => (
                      <button
                        key={`online-${index}`}
                        className={`flex justify-between items-center w-full p-3 rounded-lg border transition-all duration-200 ${
                          selectedSlot === slot
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-blue-500 mr-2" />
                          <span>{slot.start_time} - {slot.end_time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Max: {slot.max_appointments}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-4 text-center text-gray-500">
                      No online slots available for this day.
                    </div>
                  )}
                </div>
              </div>
              
              {/* Offline slots */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 mr-2">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h4 className="text-md font-medium text-gray-800">In-Person Visits</h4>
                </div>
                
                <div className="space-y-2">
                  {availableOfflineSlots.length > 0 ? (
                    availableOfflineSlots.map((slot, index) => (
                      <button
                        key={`offline-${index}`}
                        className={`flex justify-between items-center w-full p-3 rounded-lg border transition-all duration-200 ${
                          selectedSlot === slot
                            ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                            : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                        }`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-green-500 mr-2" />
                          <span>{slot.start_time} - {slot.end_time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Max: {slot.max_appointments}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-4 text-center text-gray-500">
                      No in-person slots available for this day.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Appointments section */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {selectedSlot 
                ? `Appointments (${selectedSlot.start_time} - ${selectedSlot.end_time})`
                : "Select a time slot to view appointments"}
            </h3>
            
            {(isLoading || isFetching) ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : (
              <div className="space-y-4">
                {/* replace todayAppointment w/ filteredData */}
                {todayAppointment && todayAppointment.length > 0 ? (
                  todayAppointment.map((queue, ix) => (
                    <DoctorQueueCard key={ix} data={queue} refetch={refetch} />
                  ))
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <div className="flex justify-center mb-3">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700 mb-1">No appointments found</h4>
                    <p className="text-gray-500">
                      {selectedSlot 
                        ? "There are no appointments scheduled for this time slot."
                        : "Please select a time slot to view appointments."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorQueue;
