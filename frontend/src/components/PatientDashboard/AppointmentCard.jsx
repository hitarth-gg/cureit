// import { Badge, Button, Code, DataList } from "@radix-ui/themes";
// import CancelDialog from "./CancelDialog";
// import { useState, useEffect } from "react";
// import QRScanner from "./QRscanner.jsx";
// import { toast } from "sonner";

// function AppointmentCard({ data, refetch }) {
//   const {
//     appointmentId,
//     doctor,
//     specialization,
//     hospital,
//     address,
//     appointment_date,
//     queuePosition,
//     plus_code,
//     meetingLink,
//     appointment_time,
//     checked_in_status,
//   } = data;
//   const appointmentTypes = ["orange", "blue"];
//   const appointmentType =
//     appointment_date ===
//       new Date().toLocaleDateString("en-IN").replace(/\//g, "-")
//       ? appointmentTypes[0]
//       : appointmentTypes[1];

//   const [expectedTime, setExpectedTime] = useState(null);
//   const [showScanner, setShowScanner] = useState(false);

//   useEffect(() => {
//     if (
//       appointment_time === "N/A" ||
//       queuePosition === "N/A" ||
//       isNaN(Number(queuePosition)) ||
//       appointment_date === "N/A"
//     ) {
//       setExpectedTime("N/A");
//       return;
//     }
//     const { start_time, end_time, mode } = appointment_time || {};

//     if (!start_time || !end_time) {
//       setExpectedTime("N/A");
//       return;
//     }
//     let availableTime = `${appointment_date}T${start_time}`;

//     const availableDate = new Date(availableTime);
//     const currentTime = new Date();
//     const appointmentDay = new Date(appointment_date);
//     const queueDelayMinutes = (Number(queuePosition) - 1) * 15;
//     const expectedTime = new Date(availableDate.getTime() + queueDelayMinutes * 60000);
//     if (mode === "online") {
//     }
//     if (currentTime.toISOString().split("T")[0] < appointment_date) {
//       setExpectedTime(
//         expectedTime.toLocaleTimeString("en-IN", {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       );
//     } else if (currentTime.toISOString().split("T")[0] === appointment_date) {
//       if (currentTime > availableDate) {
//         const adjustedTime = new Date(currentTime.getTime() + queueDelayMinutes * 60000);
//         setExpectedTime(
//           adjustedTime.toLocaleTimeString("en-IN", {
//             hour: "2-digit",
//             minute: "2-digit",
//           })
//         );
//       } else {
//         setExpectedTime(
//           expectedTime.toLocaleTimeString("en-IN", {
//             hour: "2-digit",
//             minute: "2-digit",
//           })
//         );
//       }
//     } else {
//       setExpectedTime("N/A");
//     }
//   }, [appointment_time, queuePosition, appointment_date]);

//   const handleScanSuccess = (scanData) => {
//     console.log(scanData);

//     // Play a sound on successful scan.
//     if (scanData != "fail") {
//       const audio = new Audio("/cureit/sound/Check_In_Successful.mp3"); // Ensure this file exists in your public folder
//       audio.play().catch((err) => console.error("Audio play error:", err));
//     }

//     console.log("Scanned data:", scanData);
//     // Process scanData further (e.g., send to backend)

//     // Automatically close the scanner.
//     setShowScanner(false);
//   };

//   return (
//     <div>
//       <div className="flex justify-between gap-y-1 rounded-md border-2 px-4 py-2 font-noto">
//         <DataList.Root
//           orientation={{
//             initial: "vertical",
//             sm: "horizontal",
//           }}
//           style={{ gap: ".65rem" }}
//           size={{
//             initial: "1",
//             md: "2",
//           }}
//         >
//           <DataList.Item>
//             <DataList.Label minWidth="88px">Doctor</DataList.Label>
//             <DataList.Value>
//               <Code variant="ghost">{doctor}</Code>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item align="">
//             <DataList.Label minWidth="88px">Specialization</DataList.Label>
//             <DataList.Value>
//               <Badge color="indigo" variant="soft" radius="small">
//                 {specialization}
//               </Badge>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item>
//             <DataList.Label minWidth="88px">Hospital</DataList.Label>
//             <DataList.Value>
//               <Code variant="ghost">{hospital}</Code>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item>
//             <DataList.Label minWidth="88px">Address</DataList.Label>
//             <DataList.Value>
//               <div className="flex items-center gap-x-2">
//                 <Code variant="ghost">{address}</Code>
//                 <Button
//                   color="iris"
//                   size="1"
//                   onClick={() =>
//                     window.open(
//                       `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(plus_code)}`,
//                       "_blank",
//                     )
//                   }
//                 >
//                   Get Directions
//                 </Button>
//               </div>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item>
//             <DataList.Label minWidth="88px">Mode</DataList.Label>
//             <DataList.Value>
//             <Badge variant="ghost" color="green">
//                 {appointment_time.mode}
//               </Badge>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item>
//             <DataList.Label minWidth="88px">Expected Time</DataList.Label>
//             <DataList.Value>
//               <Badge variant="ghost" color={appointmentType}>
//                 {expectedTime}
//               </Badge>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item>
//             <DataList.Label minWidth="88px">Appointment Date</DataList.Label>
//             <DataList.Value>
//               <Badge variant="" color={appointmentType}>
//                 {appointment_date}
//               </Badge>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item>
//             <DataList.Label minWidth="88px">Queue Position</DataList.Label>
//             <DataList.Value>
//               <Badge variant="" color={appointmentType}>
//                 {queuePosition}
//               </Badge>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item>
//             <div className="flex items-center justify-start gap-4 md:hidden">
//               <CancelDialog data={data} refetch={refetch} />

//               {appointment_time.mode === "online" ? (
//                 <Button
//                   onClick={() => window.open(meetingLink, "_blank", "noopener,noreferrer")}
//                 >
//                   <div className="text-xs">Join Meet</div>
//                 </Button>
//               ) : (
//                 <>
//                   {!checked_in_status ? (
//                     !showScanner ? (
//                       <Button onClick={() => setShowScanner(true)}>
//                         <div className="text-xs">Scan QR Code</div>
//                       </Button>
//                     ) : (
//                       <div
//                         style={{
//                           position: "fixed",
//                           top: 0,
//                           left: 0,
//                           width: "100%",
//                           height: "100%",
//                           backgroundColor: "rgba(0, 0, 0, 0.7)",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           zIndex: 1000,
//                         }}
//                       >
//                         <div
//                           style={{
//                             position: "relative",
//                             backgroundColor: "#fff",
//                             padding: "2rem",
//                             borderRadius: "8px",
//                             maxWidth: "90%",
//                             maxHeight: "90%",
//                             overflow: "auto",
//                             textAlign: "center",
//                           }}
//                         >
//                           {/* Close Button */}
//                           <button
//                             onClick={() => setShowScanner(false)}
//                             style={{
//                               position: "absolute",
//                               top: "16px",
//                               right: "16px",
//                               backgroundColor: "#fff",
//                               border: "2px solid red",
//                               borderRadius: "50%",
//                               width: "40px",
//                               height: "40px",
//                               fontSize: "20px",
//                               color: "red",
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               padding: 0,
//                             }}
//                             aria-label="Close"
//                           >
//                             X
//                           </button>

//                           <QRScanner
//                             appointmentId={appointmentId}
//                             onScanSuccess={(data) => {
//                               handleScanSuccess(data);
//                             }}
//                           />
//                         </div>
//                       </div>
//                     )
//                   ) : (
//                     <Button disabled={true}>
//                       Checked In Successfully
//                     </Button>
//                   )}
//                 </>
//               )}
//             </div>
//           </DataList.Item>

//         </DataList.Root>
//         <div>
//           <div className="ml-4 mt-5 hidden items-center justify-center gap-4 md:flex">
//             <CancelDialog data={data} refetch={refetch} />

//             {appointment_time.mode === "online" ? (
//               <Button
//                 onClick={() => window.open(meetingLink, "_blank", "noopener,noreferrer")}
//               >
//                 <div className="text-xs">Join Meet</div>
//               </Button>
//             ) : (
//               <>
//                 {!checked_in_status ? (
//                   !showScanner ? (
//                     <Button onClick={() => setShowScanner(true)}>
//                       <div className="text-xs">Scan QR Code</div>
//                     </Button>
//                   ) : (
//                     <div
//                       style={{
//                         position: "fixed",
//                         top: 0,
//                         left: 0,
//                         width: "100%",
//                         height: "100%",
//                         backgroundColor: "rgba(0, 0, 0, 0.7)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         zIndex: 1000,
//                       }}
//                     >
//                       <div
//                         style={{
//                           position: "relative",
//                           backgroundColor: "#fff",
//                           padding: "2rem",
//                           borderRadius: "8px",
//                           maxWidth: "90%",
//                           maxHeight: "90%",
//                           overflow: "auto",
//                           textAlign: "center",
//                         }}
//                       >
//                         {/* Close Button */}
//                         <button
//                           onClick={() => setShowScanner(false)}
//                           style={{
//                             position: "absolute",
//                             top: "16px",
//                             right: "16px",
//                             backgroundColor: "#fff",
//                             border: "2px solid red",
//                             borderRadius: "50%",
//                             width: "40px",
//                             height: "40px",
//                             fontSize: "20px",
//                             color: "red",
//                             cursor: "pointer",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             padding: 0,
//                           }}
//                           aria-label="Close"
//                         >
//                           X
//                         </button>

//                         <QRScanner
//                           appointmentId={appointmentId}
//                           onScanSuccess={(data) => {
//                             handleScanSuccess(data);
//                           }}
//                         />
//                       </div>
//                     </div>
//                   )
//                 ) : (
//                   <Button disabled={true}>
//                     Checked In Successfully
//                   </Button>
//                 )}
//               </>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default AppointmentCard;

/* ------------------------------------------------------ */
import { Badge, Button, Code, DataList } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import QRScanner from "./QRscanner.jsx";
import CancelDialog from "./CancelDialog";
import {
  CalendarDays,
  MapPin,
  UserRound,
  Building,
  Clock,
  ListOrdered,
  Video,
  QrCode,
} from "lucide-react";

function AppointmentCard({ data, refetch, index }) {
  const {
    appointmentId,
    doctor,
    specialization,
    hospital,
    address,
    appointment_date,
    queuePosition,
    plus_code,
    meetingLink,
    appointment_time,
    checked_in_status,
  } = data;

  // Determine if appointment is today or future
  const isToday =
    appointment_date ===
    new Date().toLocaleDateString("en-IN").replace(/\//g, "-");
  const statusColor = isToday ? "orange" : "blue";
  const [expectedTime, setExpectedTime] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  // Calculate expected time
  useEffect(() => {
    if (
      appointment_time === "N/A" ||
      queuePosition === "N/A" ||
      isNaN(Number(queuePosition)) ||
      appointment_date === "N/A"
    ) {
      setExpectedTime("N/A");
      return;
    }

    const { start_time, end_time, mode } = appointment_time || {};

    if (!start_time || !end_time) {
      setExpectedTime("N/A");
      return;
    }

    let availableTime = `${appointment_date}T${start_time}`;
    const availableDate = new Date(availableTime);
    const currentTime = new Date();
    const queueDelayMinutes = (Number(queuePosition) - 1) * 4;
    const expectedTime = new Date(
      availableDate.getTime() + queueDelayMinutes * 60000,
    );

    const formatOptions = { hour: "2-digit", minute: "2-digit" };

    if (currentTime.toISOString().split("T")[0] < appointment_date) {
      // Future appointment
      setExpectedTime(expectedTime.toLocaleTimeString("en-IN", formatOptions));
    } else if (currentTime.toISOString().split("T")[0] === appointment_date) {
      // Today's appointment
      if (currentTime > availableDate) {
        const adjustedTime = new Date(
          currentTime.getTime() + queueDelayMinutes * 60000,
        );
        setExpectedTime(
          adjustedTime.toLocaleTimeString("en-IN", formatOptions),
        );
      } else {
        setExpectedTime(
          expectedTime.toLocaleTimeString("en-IN", formatOptions),
        );
      }
    } else {
      // Past appointment
      setExpectedTime("N/A");
    }
  }, [appointment_time, queuePosition, appointment_date]);

  const handleScanSuccess = (scanData) => {
    console.log("Scanned data:", scanData);

    if (scanData !== "fail") {
      const audio = new Audio("/cureit/sound/Check_In_Successful.mp3");
      audio.play().catch((err) => console.error("Audio play error:", err));
    }

    setShowScanner(false);
  };

  const getAppointmentStatusBadge = () => {
    if (checked_in_status) {
      return (
        <Badge size="2" variant="solid" color="green">
          Checked In
        </Badge>
      );
    }
    if (isToday) {
      return (
        <Badge size="2" variant="solid" color="orange">
          Today
        </Badge>
      );
    }
    return (
      <Badge size="2" variant="solid" color="blue">
        Upcoming
      </Badge>
    );
  };

  return (
    <div className="mb-4 font-noto">
      <div className="overflow-hidden rounded-lg border-2 bg-white shadow-md">
        {/* Header with status */}
        <div className="flex items-center justify-between border-b bg-gray-50 p-3">
          <div className="flex items-center">
            {(index+1) > 0 && <div className="text-lg font-medium mr-2 text-gray-500">{index+1}.</div>}
            <UserRound className="mr-2 text-indigo-600" size={18} />
            <span className="text-lg font-medium">{doctor}</span>
            <Badge
              color="indigo"
              variant="soft"
              radius="small"
              className="ml-2"
            >
              {specialization}
            </Badge>
          </div>
          <div>{getAppointmentStatusBadge()}</div>
        </div>

        {/* Main content */}
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Left column */}
            <div className="space-y-3">
              <div className="flex items-start">
                <Building
                  className="mr-2 mt-1 flex-shrink-0 text-gray-500"
                  size={16}
                />
                <div>
                  <div className="text-sm text-gray-500">Hospital</div>
                  <div className="font-medium">{hospital}</div>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin
                  className="mr-2 mt-1 flex-shrink-0 text-gray-500"
                  size={16}
                />
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div className="mb-1 font-medium">{address}</div>
                  <Button
                    color="iris"
                    size="1"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(plus_code)}`,
                        "_blank",
                      )
                    }
                  >
                    Get Directions
                  </Button>
                </div>
              </div>

              <div className="flex items-start">
                <CalendarDays
                  className="mr-2 mt-1 flex-shrink-0 text-gray-500"
                  size={16}
                />
                <div>
                  <div className="text-sm text-gray-500">Appointment Date</div>
                  <div className="font-medium">
                    <Badge variant="surface" color={statusColor}>
                      {appointment_date}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-3">
              <div className="flex items-start">
                <Clock
                  className="mr-2 mt-1 flex-shrink-0 text-gray-500"
                  size={16}
                />
                <div>
                  <div className="text-sm text-gray-500">Expected Time</div>
                  <div className="font-medium">
                    <Badge variant="surface" color={statusColor}>
                      {expectedTime}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <ListOrdered
                  className="mr-2 mt-1 flex-shrink-0 text-gray-500"
                  size={16}
                />
                <div>
                  <div className="text-sm text-gray-500">Queue Position</div>
                  <div className="font-medium">
                    <Badge variant="surface" color={statusColor}>
                      {queuePosition}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                {appointment_time.mode === "online" ? (
                  <Video
                    className="mr-2 mt-1 flex-shrink-0 text-gray-500"
                    size={16}
                  />
                ) : (
                  <QrCode
                    className="mr-2 mt-1 flex-shrink-0 text-gray-500"
                    size={16}
                  />
                )}
                <div>
                  <div className="text-sm text-gray-500">Mode</div>
                  <div className="font-medium">
                    <Badge variant="soft" color="green">
                      {appointment_time.mode}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 border-t bg-gray-50 p-3">
          <CancelDialog data={{...data, expectedTime}} refetch={refetch} />

          {appointment_time.mode === "online" ? (
            <Button
              color="green"
              onClick={() =>
                window.open(meetingLink, "_blank", "noopener,noreferrer")
              }
            >
              <Video size={16} className="mr-1" />
              <span>Join Meet</span>
            </Button>
          ) : (
            <>
              {!checked_in_status ? (
                <Button
                  color="blue"
                  onClick={() => setShowScanner(true)}
                >
                  <QrCode size={16} className="mr-1" />
                  <span>Check In</span>
                </Button>
              ) : (
                <Button disabled={true} color="green">
                  Checked In Successfully
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6">
            <button
              onClick={() => setShowScanner(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-500 bg-white text-red-500 hover:text-red-700"
              aria-label="Close"
            >
              ✕
            </button>

            <h3 className="mb-4 text-center text-lg font-medium">
              Scan QR Code to Check In
            </h3>

            <QRScanner
              appointmentId={appointmentId}
              onScanSuccess={handleScanSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentCard;
