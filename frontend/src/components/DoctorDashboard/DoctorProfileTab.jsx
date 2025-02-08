import { Avatar, Badge, Code, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import useGetDoctorProfileDetails from "../../hooks/useGetDoctorProfileDetails";
import Loader from "../Loader";
import EditDoctorProfile from "./EditDoctorProfile";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { data } from "autoprefixer";

function DoctorProfileTab() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
    age: "",
    gender: "",
    specialization: "",
    uid: 234,
  });

  const profileImagePlaceholder =
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg";
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

  const navigate = useNavigate();
  const {
    isLoading: isLoadingDetails,
    data: dataDetails,
    error: errorDetails,
    refetch: refetchDetails,
    isFetching: isFetchingDetails,
  } = useGetDoctorProfileDetails(userId, accessToken);

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
      if (dataDetails) {
        console.log(dataDetails);
        setProfile({
          name: dataDetails.profiles.name || "",
          email: dataDetails.profiles.email || "",
          phone: dataDetails.profiles.phone_number || "",
          address: dataDetails.profiles.address || "",
          profileImage: dataDetails.profiles.avatar_url,
          age: dataDetails.profile.age || null,
          gender: dataDetails.profiles.gender || "",
          // phone_verified: data.profiles.phone_verified,
          specialization: dataDetails.profile.specialization || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    console.log("hello", " ", userId);
    if (userId) fetchUserProfile();
  }, [userId, dataDetails]);

  useEffect(() => {
    console.log("profile ", profile);
  }, [profile]);

  return (
    <div className="flex flex-col gap-y-6">
      {/* {isLoading && <Loader />} */}
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
              src={profile.profileImage || profileImagePlaceholder}
              fallback={profile.name[0]?.toUpperCase()}
            />
          </Flex>
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
            <span className="font-semibold">Specialization:</span>{" "}
            <Code>{profile?.specialization} </Code>
          </div>
          <div>
            <span className="font-semibold">Age & Gender:</span> {profile?.age}{" "}
            {profile.gender}
          </div>
          <div>
            {/* <EditDoctorProfile profile={profile} setProfile={setProfile} /> */}
          </div>
        </div>
      </div>

      {/* <div className="mt-6 flex flex-col gap-y-3">
        <div className="text-base font-semibold">
          Appointments scheduled for today
        </div>
      </div> */}
    </div>
  );
}

export default DoctorProfileTab;
