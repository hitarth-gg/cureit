import { Avatar, Flex } from "@radix-ui/themes";
import { useState } from "react";

function ProfileTab() {
  const [profile, setProfile] = useState({
    name: "Rakesh Manmohan Tiwari",
    email: "rakeshmtiwari12@email.com",
    phone: "+91 9827593710",
    address: "Sector 24, Aliganj, Lucknow, India",
    profileImage:
      "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    age: 25,
    gender: "male",
  });
  const profileImagePlaceholder =
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg";

  return (
    <div>
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
            <span className="font-semibold">Age & Gender:</span> {profile?.age} {profile.gender}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;
