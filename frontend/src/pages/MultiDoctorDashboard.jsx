import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { supabase } from "../utils/supabaseClient";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const SOCKET_SERVER_URL = `${API_URL}`;
const api = import.meta.env.VITE_API_BASE_URL;

const NoAppointmentsView = () => (
  <div className="flex h-[calc(100vh-200px)] items-center justify-center">
    <div className="text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto mb-4 h-24 w-24 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p className="text-2xl font-semibold text-gray-600">
        No appointments today
      </p>
      <p className="mt-2 text-gray-500">All doctors have clear schedules</p>
    </div>
  </div>
);

const MultiDoctorDashboard = () => {
  const [token, setToken] = useState(
    localStorage.getItem("sb-vakmfwtcbdeaigysjgch-auth-token"),
  );
  const data = JSON.parse(token);

  // console.log(token);
  const [receptionId, setReceptionId] = useState(data?.user?.id);
  const [doctorQueues, setDoctorQueues] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setReceptionId(user.id);
      }
      if (error) console.error("Error fetching user:", error);
    };
    fetchUser();
  }, [token]);

  const fetchCompleteReceptionDoctorQueue = async (receptionId) => {
    try {
      const response = await axios.get(
        `${api}/api/multiDoctorDashboardRoutes/allNextAppointments/${receptionId}`,
      );
      const doctorData = response.data;
      setDoctorQueues(doctorData);
    } catch (error) {
      console.error(
        `Error fetching queue for reception ${receptionId}:`,
        error,
      );
    }
  };

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    fetchCompleteReceptionDoctorQueue(receptionId);

    socket.on("doctorQueueChanged", (data) => {
      const { doctorId, receptionIdFromSocket } = data;
      if (receptionIdFromSocket == receptionId) {
        fetchDoctorQueue(doctorId);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [receptionId]);

  const fetchDoctorQueue = async (doctorId) => {
    const onlyId = doctorId.split("+")[0];

    try {
      const response = await axios.get(
        `${api}/api/multiDoctorDashboardRoutes/nextAppointments/${onlyId}`,
      );
      const doctorData = response.data;

      setDoctorQueues((prevQueues) => ({
        ...prevQueues,
        [doctorId]: doctorData,
      }));
    } catch (error) {
      console.error(`Error fetching queue for doctor ${doctorId}:`, error);
    }
  };

  // Extract doctor name from doctorId
  const extractDoctorName = (doctorId) => {
    const parts = doctorId.split("+");
    return parts.length > 1 ? parts[1] : doctorId;
  };

  // Check if all doctors have empty queues
  const allDoctorsHaveNoAppointments = Object.entries(doctorQueues).every(
    ([_, patients]) => patients.length === 0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 p-6">
      <h1 className="mb-10 text-center text-4xl font-extrabold tracking-tight text-indigo-900">
        Patient Queues
      </h1>

      {allDoctorsHaveNoAppointments ? (
        <NoAppointmentsView />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(doctorQueues).map(([doctorId, patients]) => {
            // If no patients for this doctor, show No Appointments
            if (patients.length === 0) {
              return (
                <div
                  key={doctorId}
                  className="overflow-hidden rounded-xl bg-white shadow-lg"
                >
                  <div className="bg-indigo-600 p-4 text-center">
                    <h2 className="text-xl font-bold text-white">
                      {extractDoctorName(doctorId)}
                    </h2>
                  </div>
                  <div className="flex h-48 items-center justify-center">
                    <p className="text-center text-gray-500">
                      No appointments today
                    </p>
                  </div>
                </div>
              );
            }

            // Sort patients to ensure Q1 is first
            const sortedPatients = [...patients].sort(
              (a, b) => a.queuePosition - b.queuePosition,
            );

            return (
              <div
                key={doctorId}
                className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <div className="bg-indigo-600 p-4 text-center">
                  <h2 className="text-xl font-bold text-white">
                    {extractDoctorName(doctorId)}
                  </h2>
                </div>

                <div className="space-y-3 p-4">
                  {sortedPatients.map((patient, index) => (
                    <div
                      key={patient.name + index}
                      className={` ${
                        index === 0
                          ? "border-green-500 bg-green-100 text-green-900"
                          : "border-gray-200 bg-gray-50 text-gray-700"
                      } flex items-center space-x-4 rounded-lg border p-3 transition-colors`}
                    >
                      <span
                        className={` ${
                          index === 0
                            ? "bg-green-500 text-white"
                            : "bg-indigo-500 text-white"
                        } flex h-10 w-10 items-center justify-center rounded-full font-bold`}
                      >
                        Q{patient.queuePosition}
                      </span>
                      <span className="flex-grow text-base font-medium">
                        {patient.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiDoctorDashboard;
