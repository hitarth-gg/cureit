// import { Badge, Button, Code, DataList, DropdownMenu } from "@radix-ui/themes";
// import SeeDetails from "./SeeDetails";
// import { useState, useEffect } from "react";
// import OtpModal from "./OtpModal";
// import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
// import SkipAppointment from "./SkipAppointment";
// import usePostAppointmentStatus from "../../hooks/usePostAppointmentStatus";
// import { toast } from "sonner";
// import { set } from "lodash";
// function DoctorQueueCard({ data, refetch }) {
//   const {
//     patientName,
//     patientId,
//     age,
//     gender,
//     hospital,
//     issue,
//     issueDetails,
//     appointment_time,
//     appointment_date,
//     queuePosition,
//     available_from,
//     meetingLink,
//   } = data;
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [updateAppointmentStatusSuccess, setUpdateAppointmentStatusSuccess] =
//     useState(false);
//   const { mutate: saveAppointmentStatus } = usePostAppointmentStatus(
//     setUpdateAppointmentStatusSuccess,
//   );
//   async function skipAppointment() {
//     // console.log("in skip appointment func");
//     setUpdateAppointmentStatusSuccess(false);
//     saveAppointmentStatus.mutate(
//       {
//         appointmentId: data.appointmentId,
//         status: "missed",
//       },
//       {
//         onSuccess: () => {
//           toast.success("Appointment Skipped");
//         },
//         onError: () => {
//           toast.error("Error skipping appointment");
//         },
//       },
//     );
//   }
//   const appointmentTypes = ["orange", "blue"]; // green for today's appointment, blue for future appointment
//   const appointmentType =
//     appointment_date ===
//     new Date().toLocaleDateString("en-IN").replace(/\//g, "-")
//       ? appointmentTypes[0]
//       : appointmentTypes[1];

//   const [expectedTime, setExpectedTime] = useState("");

//   useEffect(() => {
//     if (
//       appointment_time === "N/A" ||
//       queuePosition === "N/A" ||
//       isNaN(Number(queuePosition)) || // Ensures queuePosition is treated as a number
//       appointment_date === "N/A"
//     ) {
//       setExpectedTime("N/A");
//       return;
//     }

//     // Extract start_time, end_time, and mode from chosen_slot
//     const { start_time, end_time, mode } = appointment_time || {};

//     if (!start_time || !end_time) {
//       setExpectedTime("N/A");
//       return;
//     }

//     // Handle mode-based adjustments (if needed)
//     let availableTime = `${appointment_date}T${start_time}`;

//     const availableDate = new Date(availableTime);
//     const currentTime = new Date();
//     const appointmentDay = new Date(appointment_date);

//     // Add queue-based delay (15 mins per position)
//     const queueDelayMinutes = (Number(queuePosition) - 1) * 15;
//     const expectedTime = new Date(availableDate.getTime() + queueDelayMinutes * 60000);

//     // If the appointment is online, we may want to handle it differently
//     if (mode === "online") {
//       // For "online" appointments, maybe you want to adjust or show different logic,
//       // e.g., showing an online consultation start time or ignoring certain local adjustments.
//       // For now, we'll keep it simple and proceed similarly to "offline" appointments.
//       // You can add any specific logic for "online" mode here if needed.
//     }

//     // Ensure we correctly display expected time based on the current date
//     if (currentTime.toISOString().split("T")[0] < appointment_date) {
//       // Future appointment -> Use `availableTime + queue delay`
//       setExpectedTime(
//         expectedTime.toLocaleTimeString("en-IN", {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       );
//     } else if (currentTime.toISOString().split("T")[0] === appointment_date) {
//       // Same-day appointment
//       if (currentTime > availableDate) {
//         // If current time is already past `start_time`, adjust from now
//         const adjustedTime = new Date(currentTime.getTime() + queueDelayMinutes * 60000);
//         setExpectedTime(
//           adjustedTime.toLocaleTimeString("en-IN", {
//             hour: "2-digit",
//             minute: "2-digit",
//           })
//         );
//       } else {
//         // If still before `start_time`, adjust from `start_time`
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

//   return (
//     <div>
//       <div className="flex justify-between gap-1 rounded-md border-2 px-4 py-2 font-noto">
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
//             <DataList.Label minWidth="88px">Patient Name</DataList.Label>
//             <DataList.Value>
//               <Code variant="ghost">{patientName}</Code>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item>
//             <DataList.Label minWidth="88px">Age & Gender</DataList.Label>
//             <DataList.Value>
//               <Code variant="ghost">
//                 {age} {gender}
//               </Code>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item>
//             <DataList.Label minWidth="88px">Hospital</DataList.Label>
//             <DataList.Value>
//               <Code variant="ghost">{hospital}</Code>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item>
//             <DataList.Label minWidth="88px">
//               Mode
//             </DataList.Label>
//             <DataList.Value>
//             <Badge variant="ghost" color="green">
//                 {appointment_time.mode}
//               </Badge>
//             </DataList.Value>
//           </DataList.Item>
//           <DataList.Item>
//             <DataList.Label minWidth="88px">
//               Expected Appointment Time
//             </DataList.Label>
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
//             <div className={`flex flex-row justify-start gap-2 md:hidden`}>
//             {appointment_time.mode === "online" ? (
//               <div className="flex gap-2">
//                 <SkipAppointment skipAppointment={skipAppointment} />
//                 <Button
//                   onClick={() => window.open(meetingLink, "_blank", "noopener,noreferrer")}
//                 >
//                   <div className="text-xs">Join Meet</div>
//                 </Button>
//                 <SeeDetails
//                 data={data}
//                 refetch={refetch}
//                 otpVerified={true}
//               />
//               </div>
//               ) : (
//               <div className="flex gap-2">
//                 {!otpVerified && (
//                   <>
//                     <SkipAppointment skipAppointment={skipAppointment} />
//                     <OtpModal
//                       otpVerified={otpVerified}
//                       setOtpVerified={setOtpVerified}
//                       id={patientId}
//                     />
//                   </>
//                 )}
//                 {
//                   <SeeDetails
//                     data={data}
//                     refetch={refetch}
//                     otpVerified={otpVerified}
//                   />
//                 }
//               </div>)}
//             </div>
//           </DataList.Item>
//         </DataList.Root>

//         <div className="ml-4 hidden flex-col items-center justify-center gap-2 md:flex md:flex-row">
//           {/* <CancelDialog data={data} refetch={refetch} /> */}
//           {appointment_time.mode === "online" ? (
//               <div className="flex gap-2">
//                 <SkipAppointment skipAppointment={skipAppointment} />
//                 <Button
//                   onClick={() => window.open(meetingLink, "_blank", "noopener,noreferrer")}
//                 >
//                   <div className="text-xs">Join Meet</div>
//                 </Button>
//                 <SeeDetails
//                 data={data}
//                 refetch={refetch}
//                 otpVerified={true}
//               />
//               </div>
//               ) : (
//               <div className="flex gap-2">
//                 {!otpVerified && (
//                   <>
//                     <SkipAppointment skipAppointment={skipAppointment} />
//                     <OtpModal
//                       otpVerified={otpVerified}
//                       setOtpVerified={setOtpVerified}
//                       id={patientId}
//                     />
//                   </>
//                 )}
//                 {
//                   <SeeDetails
//                     data={data}
//                     refetch={refetch}
//                     otpVerified={otpVerified}
//                   />
//                 }
//               </div>)}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DoctorQueueCard;

/* ------------------------------------------------------ */

import { useState, useEffect } from "react";
import { Badge, Button, Code, DataList } from "@radix-ui/themes";
import {
  Clock,
  User,
  Hospital,
  Calendar,
  ListOrdered,
  Video,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import SeeDetails from "./SeeDetails";
import OtpModal from "./OtpModal";
import SkipAppointment from "./SkipAppointment";
import usePostAppointmentStatus from "../../hooks/usePostAppointmentStatus";

function DoctorQueueCard({ data, refetch, index }) {
  const {
    patientName,
    patientId,
    age,
    gender,
    hospital,
    issue,
    issueDetails,
    appointment_time,
    appointment_date,
    queuePosition,
    available_from,
    meetingLink,
  } = data;

  const [otpVerified, setOtpVerified] = useState(false);
  const [updateAppointmentStatusSuccess, setUpdateAppointmentStatusSuccess] =
    useState(false);
  const [expectedTime, setExpectedTime] = useState("");

  const { mutate: saveAppointmentStatus } = usePostAppointmentStatus(
    setUpdateAppointmentStatusSuccess,
  );

  const isToday =
    appointment_date ===
    new Date().toLocaleDateString("en-IN").replace(/\//g, "-");

  const appointmentColor = isToday ? "orange" : "blue";
  const isOnline = appointment_time.mode === "online";

  function skipAppointment() {
    setUpdateAppointmentStatusSuccess(false);
    saveAppointmentStatus(
      {
        appointmentId: data.appointmentId,
        status: "missed",
      },
      {
        onSuccess: () => {
          toast.success("Appointment Skipped");
        },
        onError: () => {
          toast.error("Error skipping appointment");
        },
      },
    );
  }

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

    // Add queue-based delay (15 mins per position)
    const queueDelayMinutes = (Number(queuePosition) - 1) * 4;
    const expectedTime = new Date(
      availableDate.getTime() + queueDelayMinutes * 60000,
    );

    // Calculate display time based on current date
    if (currentTime.toISOString().split("T")[0] < appointment_date) {
      // Future appointment
      setExpectedTime(
        expectedTime.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } else if (currentTime.toISOString().split("T")[0] === appointment_date) {
      if (currentTime > availableDate) {
        // If current time is already past start_time, adjust from now
        const adjustedTime = new Date(
          currentTime.getTime() + queueDelayMinutes * 60000,
        );
        setExpectedTime(
          adjustedTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      } else {
        // If still before start_time, adjust from start_time
        setExpectedTime(
          expectedTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      }
    } else {
      setExpectedTime("N/A");
    }
  }, [appointment_time, queuePosition, appointment_date]);

  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg">
      {/* Header with patient info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(index+1) > 0 && <div className="mr-2 text-lg font-medium text-gray-500">
              {index + 1}.
            </div>}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {patientName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{age} years</span>
                <span>•</span>
                <span>{gender}</span>
              </div>
            </div>
          </div>

          <Badge
            size="2"
            variant="soft"
            color={appointmentColor}
            className="flex items-center gap-1"
          >
            {isOnline ? <Video size={14} /> : <MapPin size={14} />}
            {isOnline ? "Online" : "In-person"}
          </Badge>
        </div>
      </div>

      {/* Appointment details */}
      <div className="grid grid-cols-1 gap-1 p-4 md:grid-cols-3">
        <div className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-50">
          <Hospital size={18} className="text-gray-500" />
          <div>
            <div className="text-xs font-medium text-gray-500">Hospital</div>
            <div className="font-medium">{hospital}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-50">
          <Calendar size={18} className="text-gray-500" />
          <div>
            <div className="text-xs font-medium text-gray-500">Date</div>
            <div className="font-medium">{appointment_date}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-50">
          <Clock size={18} className="text-gray-500" />
          <div>
            <div className="text-xs font-medium text-gray-500">
              Expected Time
            </div>
            <div className="font-medium">{expectedTime}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md p-2 hover:bg-gray-50">
          <ListOrdered size={18} className="text-gray-500" />
          <div>
            <div className="text-xs font-medium text-gray-500">
              Queue Position
            </div>
            <div className="font-medium">{queuePosition}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 p-3">
        {isOnline ? (
          <>
            <SkipAppointment skipAppointment={skipAppointment} />
            <Button
              size={{ initial: "1", md: "2" }}
              variant="soft"
              color="cyan"
              onClick={() =>
                window.open(meetingLink, "_blank", "noopener,noreferrer")
              }
              className="flex items-center gap-1"
            >
              <Video size={14} />
              Join Meeting
            </Button>
            <SeeDetails data={data} refetch={refetch} otpVerified={true} />
          </>
        ) : (
          <>
            <SkipAppointment skipAppointment={skipAppointment} />
            {!otpVerified && (
              <OtpModal
                otpVerified={otpVerified}
                setOtpVerified={setOtpVerified}
                id={patientId}
              />
            )}
            <SeeDetails
              data={data}
              refetch={refetch}
              otpVerified={otpVerified}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorQueueCard;
