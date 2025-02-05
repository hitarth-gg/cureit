import { Pencil2Icon } from "@radix-ui/react-icons";
import { Avatar, Button, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import AppointmentCard from "./AppointmentCard";
import useGetUpcomingAppointments from "../../hooks/useGetUpcomingAppointments";
import Loader from "../Loader";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

function ProfileTab() {
  const [userId, setUserId] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const tokenString = localStorage.getItem(
    "sb-vakmfwtcbdeaigysjgch-auth-token",
  );
  const token = JSON.parse(tokenString);

  const accessToken = token.access_token;

  // const MyComponent = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
    age: "",
    gender: "",
    phone_verified: "",
  });
  const profileImagePlaceholder =
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg";
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      console.log("Session Data:", data);
      if (error) {
        console.error("Session Error:", error);
        navigate("/login");
      }
    };
    //can enter a toast here user not authenticated to view this page
    checkUserSession();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      if (error) console.error("Error fetching user:", error);
    };
    fetchUser();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/getUserById`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setProfile({
        name: data.profile.name || "",
        email: data.profile.email || "",
        phone: data.profile.phone_number || "",
        address: data.profile.address || "",
        profileImage: data.profile.avatar_url || "",
        age: data.profile.age || null,
        gender: data.profile.gender || "",
        phone_verified: data.profile.phone_verified,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    console.log("hello", " ", userId);
    if (userId) fetchUserProfile();
  }, [userId]);
  const patientId = "00bb0259-6a09-4151-9a86-29d475b28a7f";

  const { isLoading, data, error, status, refetch, isFetching } =
    useGetUpcomingAppointments(patientId);

  const [appointmentsToday, setAppointmentsToday] = useState([]);
  useEffect(() => {
    if (data) {
      console.log("Data:", data);
      const today = new Date().toISOString().split("T")[0]; 
      const appointments = data.filter(
        (appointment) => appointment.appointment_date === today,
      );
      setAppointmentsToday(appointments);
    }
  }, [data]);
  console.log(profile);

  const handleUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      console.error("No file selected");
      return;
    }
    console.log("file: ", file);

    const formData = new FormData(); // Create a FormData object to hold the file
    formData.append("file", file);
    formData.append("userId", userId);
    console.log(formData);

    // Add the file to the FormData object

    try {
      // Assuming your backend endpoint is '/upload'
      const response = await fetch(
        `${API_BASE_URL}/api/uploadProfiles/upload`,
        {
          method: "POST",
          body: formData, // Send the formData as the request body
          // headers: {
          //   // Include any headers your backend requires (e.g., Authorization)
          //   Authorization: `Bearer ${accessToken}`,
          // },
        },
      );

      if (!response.ok) {
        throw new Error("Error uploading file");
      }

      const data = await response.json();
      console.log("File uploaded successfully", data);
      const fileUrl = data.fileUrl;
      console.log("File available at:", fileUrl);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-y-6">
      {isLoading && <Loader />}
      <div className="flex flex-col justify-start gap-x-4 rounded-md border px-8 py-4 text-xs sm:gap-x-12 md:flex-row md:text-sm">
        <div className="flex flex-col items-center justify-center p-4">
          <Flex gap="2">
            <Avatar
              size={{
                initial: "4",
                sm: "5",
                md: "6",
              }}
              radius="full"
              src={profile.profileImage}
              fallback={profile.name[0]?.toUpperCase()}
            />
          </Flex>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            id="profile-image-upload"
          // style={{ display: "none" }} // Hide the input field
          />

          <div className="mt-1 w-32 text-center">{profile.name}</div>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <div>
            <span className="font-semibold">Email:</span> {profile?.email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {profile?.phone}
          </div>
          <div>
            <span className="font-semibold">Address:</span> {profile?.address}
          </div>
          <div>
            <span className="font-semibold">Age & Gender:</span> {profile?.age}{" "}
            {profile.gender}
          </div>
          <div>
            <EditProfile
              id={userId}
              profile={profile}
              setProfile={setProfile}
              fetchUserProfile={fetchUserProfile}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-y-3">
        <div className="text-base font-semibold">
          Appointments scheduled for today
        </div>
        {appointmentsToday?.map((appointment, ix) => (
          <AppointmentCard key={ix} data={appointment} />
        ))}
        {appointmentsToday?.length === 0 && (
          <div className="text-sm text-gray-400">No appointments today</div>
        )}
      </div>
    </div>
  );
}

export default ProfileTab;
