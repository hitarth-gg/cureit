import DoctorDashboard from "../components/DoctorDashboard/DoctorDashboard";
import PatientDashboard from "../components/PatientDashboard/PatientDashboard";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

function Dashboard() {
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const tokenString = localStorage.getItem(
    "sb-vakmfwtcbdeaigysjgch-auth-token",
  );
  const token = JSON.parse(tokenString);
  const accessToken = token.access_token;
  console.log(accessToken);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!accessToken) {
        setError("User is not authenticated");
        return;
      }

      try {
        // Fetch the userId from Supabase (this is where you get the user ID)
        const { data: user, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Failed to fetch user data");
          return;
        }
        console.log(user.user.id);

        // Now, make a request to your API with the userId in the body
        const response = await fetch(`${API_BASE_URL}/api/users/getRole`, {
          method: "POST", // Use POST method to send data
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send the token as part of the header
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.user.id }), // Send the userId in the request body
        });

        if (!response.ok) {
          throw new Error("Failed to fetch role");
        }

        const data = await response.json();
        console.log(data);
        setRole(data.data[0].role);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserRole();
  }, []);
  return (
    <div className="flex flex-col overflow-hidden p-4 font-noto md:px-12 md:py-8">
      {role &&
        (role === "PATIENT" ? <PatientDashboard /> : <DoctorDashboard />)}
    </div>
  );
}

export default Dashboard;
