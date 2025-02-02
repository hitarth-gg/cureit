import { Avatar, Badge, Code, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import useGetUpcomingAppointments from "../../hooks/useGetUpcomingAppointments";
import Loader from "../Loader";
import EditDoctorProfile from "./EditDoctorProfile";

function DoctorProfileTab() {
  const [profile, setProfile] = useState({
    name: "Dr. Amit Mishra",
    email: "amitmishra@email.com",
    phone: "+91 9827593710",
    address: "Sector 24, Aliganj, Lucknow, India",
    profileImage: "",
    age: 25,
    gender: "Male",
    specialization: "Cardiologist",
    uid: 234,
  });
  const profileImagePlaceholder =
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg";
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
            <EditDoctorProfile profile={profile} setProfile={setProfile} />
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
