import DoctorDashboard from "../components/DoctorDashboard/DoctorDashboard";
import PatientDashboard from "../components/PatientDashboard/PatientDashboard";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import useUserRoleById from "../hooks/useUserRoleById";
import { useGetCurrentUser } from "../hooks/useGetCurrentUser";

function Dashboard() {
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const tokenString = localStorage.getItem(
    "sb-vakmfwtcbdeaigysjgch-auth-token",
  );
  const token = JSON.parse(tokenString);
  const accessToken = token.access_token;
  console.log(accessToken);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const {
    isLoading: isLoadingRole,
    data: dataRole,
    error: errorRole,
    refetch: refetchRole,
    isFetching: isFetchingRole,
  } = useUserRoleById(userId, accessToken);

  const {
    isLoading: isLoadingUser,
    data: dataUser,
    error: errorUser,
    refetch: refetchUser,
    isFetching: isFetchingUser,
  } = useGetCurrentUser();
  // const { mutate, onSuccess, onError } = useGetCurrentUser();

  useEffect(() => {
    if (dataUser) {
      console.log(dataUser);
      setUserId(dataUser.user.id);
    }
  }, [dataUser]);

  useEffect(() => {
    if (dataRole?.data && dataRole.data.length > 0) {
      setRole(dataRole.data[0].role);
    }
  }, [userId, dataRole]);

  return (
    <div className="flex flex-col overflow-hidden p-4 font-noto md:px-12 md:py-8">
      {role &&
        (role === "PATIENT" ? <PatientDashboard /> : <DoctorDashboard />)}
    </div>
  );
}

export default Dashboard;
