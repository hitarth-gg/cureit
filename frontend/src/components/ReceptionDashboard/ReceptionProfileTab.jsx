import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useGetReceptionProfileDetails from "../../hooks/useGetReceptionProfileDetails.js";
import Loader from "../Loader";
import { supabase } from "../../utils/supabaseClient";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Maximize2,
  X,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

async function generateNewQRCode(userId) {
  if (userId == null) return;

  try {
    const response = await fetch(
      `${API_URL}/api/receptionProfileRoutes/generate-qr/${userId}`,
    );
    if (!response.ok) {
      throw new Error("Failed to generate QR code");
    }
    const data = await response.json();
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
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  const {
    isLoading: isLoadingDetails,
    data: dataDetails,
    isFetching: isFetchingDetails,
  } = useGetReceptionProfileDetails(userId, accessToken);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    profileImage: "",
    qrcode: "",
    uid: 234,
  });

  const profileImagePlaceholder =
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg";

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Session Expired Please Login Again.");
      navigate("/login", { state: { sessionExpiration: true } });
    }
  }, [token]);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session Error:", error);
        navigate("/login", { state: { sessionExpiration: true } });
      }
    };
    checkUserSession();
  }, []);

  const fetchUserProfile = async () => {
    try {
      if (dataDetails) {
        const existingQR = profile.qrcode;
        setProfile({
          name: dataDetails.profile.name || "",
          email: dataDetails.profile.email || "",
          address: dataDetails.profile.address || "",
          profileImage: dataDetails.profile.avatar_url,
          qrcode: dataDetails.profile.qrcode || existingQR,
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchUserProfile();
  }, [userId, dataDetails]);

  useEffect(() => {
    let timeoutId;

    const refreshQRCode = async () => {
      const code = await generateNewQRCode(userId);
      setProfile((prevProfile) => ({
        ...prevProfile,
        qrcode: code,
      }));

      // 10 minutes = 600,000 milliseconds
      timeoutId = setTimeout(refreshQRCode, 10 * 60 * 1000);
    };

    refreshQRCode();

    return () => clearTimeout(timeoutId);
  }, [userId]);

  const formatHospitalAddress = (address) => {
    return address.split(", ").map((part, index) => (
      <span key={index}>
        {part}
        {index < address.split(", ").length - 1 && <br />}
      </span>
    ));
  };

  // Format current time for header
  const getCurrentTime = () => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return now.toLocaleDateString("en-US", options);
  };

  const openQRDialog = () => {
    setIsQRDialogOpen(true);
  };

  const closeQRDialog = () => {
    setIsQRDialogOpen(false);
  };

  // Handle click outside the dialog to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isQRDialogOpen &&
        event.target.classList.contains("qr-dialog-overlay")
      ) {
        closeQRDialog();
      }
    };

    if (isQRDialogOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isQRDialogOpen]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Moderately sized */}
      <div className="bg-gradient-to-r from-indigo-700 to-sky-600 p-4 text-white shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={24} />
            <h1 className="text-xl font-bold">Reception Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <div className="text-sm font-medium">{getCurrentTime()}</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        {isFetchingDetails && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {!isFetchingDetails && (
          <div className="mb-4 grid grid-cols-12 gap-4">
            {/* Hospital Profile Card - Left column */}
            <div className="col-span-12 lg:col-span-8">
              <div className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow">
                <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-sky-50 p-3">
                  <div className="flex items-center gap-2">
                    <User size={20} className="text-indigo-600" />
                    <h2 className="text-lg font-semibold text-slate-800">
                      Hospital Profile
                    </h2>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex-shrink-0">
                      <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-md">
                        <img
                          src={profile.profileImage || profileImagePlaceholder}
                          alt="Hospital Logo"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="mb-2 text-xl font-bold text-slate-800">
                        {profile.name}
                      </h3>
                      <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2">
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <MapPin size={18} className="text-indigo-600" />
                            <p className="font-medium text-slate-500">
                              Address
                            </p>
                          </div>
                          <p className="pl-6 text-sm text-slate-700">
                            {profile.address &&
                              formatHospitalAddress(profile.address)}
                          </p>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <Mail size={18} className="text-indigo-600" />
                            <p className="font-medium text-slate-500">Email</p>
                          </div>
                          <p className="pl-6 text-sm text-slate-700">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Card - Right column */}
            <div className="col-span-12 lg:col-span-4">
              <div className="h-full overflow-hidden rounded-lg border border-slate-100 bg-white shadow">
                <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-sky-50 p-3">
                  <div className="flex items-center gap-2">
                    <QRCodeIcon size={20} />
                    <h2 className="text-lg font-semibold text-slate-800">
                      Hospital QR Code
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col items-center p-4">
                  <div
                    className="mb-3 cursor-pointer rounded-lg border border-slate-100 bg-white p-2 shadow-md transition-all hover:shadow-lg"
                    onClick={openQRDialog}
                  >
                    {profile.qrcode ? (
                      <div className="relative">
                        <QRCodeCanvas
                          key={profile.qrcode}
                          value={profile.qrcode}
                          size={140}
                          level="H"
                          includeMargin={true}
                          bgColor="#FFFFFF"
                          fgColor="#1e293b"
                        />
                        <div className="absolute bottom-1 right-1 rounded-full bg-indigo-600 p-1 text-white opacity-80">
                          <Maximize2 size={16} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center">
                        <p>Loading QR Code...</p>
                      </div>
                    )}
                  </div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={16} className="text-indigo-600" />
                    <p>Auto-refreshes every 10 minutes</p>
                  </div>
                  <button
                    onClick={openQRDialog}
                    className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                  >
                    <Maximize2 size={16} />
                    <span>Enlarge QR Code</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient Instructions - Full width, more compact but still readable */}
        <div>
          <div className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow">
            <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-sky-50 p-3">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Patient Check-in Instructions
                </h2>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Step 1 */}
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <Smartphone size={24} />
                    </div>
                  </div>
                  <h3 className="mb-2 text-center font-medium text-slate-800">
                    Open CureIt App
                  </h3>
                  <p className="text-center text-sm text-slate-600">
                    Launch the CureIt web application
                  </p>
                </div>

                {/* Step 2 */}
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <User size={24} />
                    </div>
                  </div>
                  <h3 className="mb-2 text-center font-medium text-slate-800">
                    Log In
                  </h3>
                  <p className="text-center text-sm text-slate-600">
                    Enter your login credentials
                  </p>
                </div>

                {/* Step 3 */}
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <Calendar size={24} />
                    </div>
                  </div>
                  <h3 className="mb-2 text-center font-medium text-slate-800">
                    Find Appointment
                  </h3>
                  <p className="text-center text-sm text-slate-600">
                    Navigate to your booked appointment
                  </p>
                </div>

                {/* Step 4 */}
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <QRCodeIcon size={24} />
                    </div>
                  </div>
                  <h3 className="mb-2 text-center font-medium text-slate-800">
                    Check In
                  </h3>
                  <p className="text-center text-sm text-slate-600">
                    Scan the QR code displayed here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Dialog */}
      {isQRDialogOpen && (
        <div className="qr-dialog-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-indigo-50 p-4">
              <div className="flex items-center gap-2">
                <QRCodeIcon size={20} />
                <h3 className="text-lg font-semibold text-slate-800">
                  Hospital QR Code
                </h3>
              </div>
              <button
                onClick={closeQRDialog}
                className="rounded-full p-1 text-slate-500 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="mb-4 rounded-lg border border-slate-200 bg-white p-3 shadow-md">
                {profile.qrcode ? (
                  <QRCodeCanvas
                    key={profile.qrcode}
                    value={profile.qrcode}
                    size={280}
                    level="H"
                    includeMargin={true}
                    bgColor="#FFFFFF"
                    fgColor="#1e293b"
                  />
                ) : (
                  <div className="flex h-64 w-64 items-center justify-center">
                    <p>Loading QR Code...</p>
                  </div>
                )}
              </div>
              <p className="mb-4 text-center text-sm text-slate-600">
                This QR code can be scanned by patients to check in for their
                appointments.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={16} className="text-indigo-600" />
                <p>Auto-refreshes every 10 minutes for security</p>
              </div>
            </div>
            <div className="flex justify-end bg-slate-50 p-4">
              <button
                onClick={closeQRDialog}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom QR code icon since it's not included in lucide-react
function QRCodeIcon({ size = 20, className = "text-indigo-600" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="5" height="5" rx="1" />
      <rect x="16" y="3" width="5" height="5" rx="1" />
      <rect x="3" y="16" width="5" height="5" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  );
}

export default ReceptionProfileTab;
