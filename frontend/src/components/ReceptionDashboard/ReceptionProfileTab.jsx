import { Avatar, Badge, Code, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import useGetReceptionProfileDetails from "../../hooks/useGetReceptionProfileDetails.js";
import Loader from "../Loader";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { data } from "autoprefixer";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@radix-ui/themes";
import { QRCodeCanvas } from "qrcode.react";
const API_URL = import.meta.env.VITE_API_BASE_URL;

async function generateNewQRCode(userId) {
  if (userId == null) {
    return;
  }
  console.log("in geerateQrCode", userId);
  try {
    const response = await fetch(
      //   `/api/receptionProfileRoutes/generate-qr/${userId}`,
      `${API_URL}/api/receptionProfileRoutes/generate-qr/${userId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to generate QR code");
    }
    const data = await response.json();
    // data.encryptedCode contains the encrypted QR code payload.
    console.log("Encrypted QR Code:", data.encryptedCode);
    return data.encryptedCode;
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
}

function ReceptionProfileTab() {
  const tokenString = localStorage.getItem(
    "sb-vakmfwtcbdeaigysjgch-auth-token",
  );

  const token = JSON?.parse(tokenString);
  const [userId, setUserId] = useState(token?.user?.id || null);
  const accessToken = token?.access_token;

  const {
    isLoading: isLoadingDetails,
    data: dataDetails,
    error: errorDetails,
    refetch: refetchDetails,
    isFetching: isFetchingDetails,
  } = useGetReceptionProfileDetails(userId, accessToken);
  const [profile, setProfile] = useState({
    name: dataDetails?.profile?.name || "",
    email: dataDetails?.profile?.email || "",
    address: dataDetails?.profile?.address || "",
    profileImage: dataDetails?.profile?.avatar_url || "",
    qrcode: dataDetails?.profile?.qrcode || "",
    uid: 234,
  });
  console.log(dataDetails);
  console.log(profile);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const profileImagePlaceholder =
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg";
  // const [userId, setUserId] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // // console.log("ggggg", token);
    if (!token) {
      toast.error("Session Expired Please Login Again.");
      navigate("/login", { state: { sessionExpiration: true } }); // Redirect to login page
    }
  }, [token]);

  // const MyComponent = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      // console.log("Session Data:", data);
      if (error) {
        console.error("Session Error:", error);
        // navigate("/login");
        navigate("/login", { state: { sessionExpiration: true } }); // Redirect to login page
      }
    };
    //can enter a toast here user not authenticated to view this page
    checkUserSession();
  }, []);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const {
  //       data: { user },
  //       error,
  //     } = await supabase.auth.getUser();
  //     if (user) setUserId(user.id);
  //     if (error) console.error("Error fetching user:", error);
  //   };
  //   fetchUser();
  // }, []);

  const fetchUserProfile = async () => {
    try {
      if (dataDetails) {
        // console.log(dataDetails);
        var a = profile.qrcode;
        setProfile({
          name: dataDetails.profile.name || "",
          email: dataDetails.profile.email || "",

          address: dataDetails.profile.address || "",
          profileImage: dataDetails.profile.avatar_url,
          qrcode: dataDetails.profile.qrcode || a,
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    // console.log("hello", " ", userId);
    if (userId) fetchUserProfile();
  }, [userId, dataDetails]);

  useEffect(() => {
    // console.log("profile ", profile);
  }, [profile]);

  useEffect(() => {
    let timeoutId;

    // Function that fetches the QR code and sets a timeout to run itself again in 10 minutes
    const refreshQRCode = async () => {
      var code = await generateNewQRCode(userId);
      setProfile((prevProfile) => ({
        ...prevProfile,
        qrcode: code,
      }));

      // 10 minutes = 600,000 milliseconds
      timeoutId = setTimeout(refreshQRCode, 10 * 60 * 1000);
    };

    // Start the cycle when the component mounts
    refreshQRCode();

    // Clean up on unmount
    return () => clearTimeout(timeoutId);
  }, [userId]);

  // console.log("profile ", profile);

  //   const mutation = useMutation({
  //     mutationFn: async () => {
  //       const response = await fetch(
  //         `${API_URL}/api/doctorProfileRoutes/download/${userId}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`, // Add your token here
  //             "Content-Type": "application/json",
  //           },
  //         },
  //       );
  //       if (!response.ok) {
  //         // console.log(response);
  //         throw new Error(response.status);
  //       }
  //       const blob = await response.blob();
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = `appointments-${new Date().toISOString().split("T")[0]}.xlsx`;
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //     },
  //     onError: (error) => {
  //       // console.log(error);
  //       if (error.message === "404") {
  //         // // console.log(error);
  //         alert("No appointments scheduled for today");
  //       } else {
  //         // console.log("Error downloading file:", error.message);
  //         alert("Failed to download the appointments file.");
  //       }
  //     },
  //   });
  return (
    <div className="flex flex-col gap-y-6">
      {isFetchingDetails && <Loader />}
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
              //   fallback={profile.name[0]?.toUpperCase()}
            />
          </Flex>
          {/* <div className="mt-1 w-32 text-center">{profile.name}</div> */}
        </div>
        <div className="flex flex-col justify-center gap-3">
          <div>
            <span className="font-semibold">Hospital Name:</span>{" "}
            {profile?.name}
          </div>
          <div>
            <span className="font-semibold">Address:</span> {profile?.address}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {profile?.email}
          </div>

          <div className="mt-12 flex w-full justify-center gap-x-4">
            {/* <Button
              color="iris"
              size="3"
              variant="soft"
              className="download-btn my-4"
              onClick={() => mutation.mutate()}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading
                ? "Downloading..."
                : "Download Today's Appointments"}
            </Button> */}
          </div>
        </div>
      </div>
      <div>Display QR CODE</div>
      {/*
            Generate a new qr code every 1 hr
            store it in reception table 
            and then make a hospital table connect it to reception table
            and then fr each hospital a nique recception would be there 
            use that receptionid to validate the QR code from patients side 

        */}

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        {/* <input
        type="text"
        value={codeword}
        onChange={(e) => setCodeword(e.target.value)}
        placeholder=""
      /> */}
        <div style={{ marginTop: "1rem" }}>
          {profile.qrcode ? (
            <>
              <QRCodeCanvas
                key={profile.qrcode}
                value={profile.qrcode}
                size={256}
                level="H"
                includeMargin={true}
              />
              <p>Current Code: {profile.qrcode}</p>{" "}
              {/* Debug: display the code */}
            </>
          ) : (
            <p>Loading QR Code...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReceptionProfileTab;
