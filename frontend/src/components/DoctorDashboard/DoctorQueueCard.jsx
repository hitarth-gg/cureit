import { Badge, Button, Code, DataList, DropdownMenu } from "@radix-ui/themes";
import SeeDetails from "./SeeDetails";
import { useState, useEffect } from "react";
import OtpModal from "./OtpModal";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import SkipAppointment from "./SkipAppointment";
import usePostAppointmentStatus from "../../hooks/usePostAppointmentStatus";
import { toast } from "sonner";
import { set } from "lodash";
function DoctorQueueCard({ data, refetch }) {
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
  const { mutate: saveAppointmentStatus } = usePostAppointmentStatus(
    setUpdateAppointmentStatusSuccess,
  );
  async function skipAppointment() {
    // console.log("in skip appointment func");
    setUpdateAppointmentStatusSuccess(false);
    saveAppointmentStatus.mutate(
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
  const appointmentTypes = ["orange", "blue"];
  const appointmentType =
    appointment_date ===
    new Date().toLocaleDateString("en-IN").replace(/\//g, "-")
      ? appointmentTypes[0]
      : appointmentTypes[1];

  const [expectedTime, setExpectedTime] = useState("");

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
    const appointmentDay = new Date(appointment_date);

    // Add queue-based delay (15 mins per position)
    const queueDelayMinutes = (Number(queuePosition) - 1) * 15;
    const expectedTime = new Date(availableDate.getTime() + queueDelayMinutes * 60000);
    if (mode === "online") {
    }
    if (currentTime.toISOString().split("T")[0] < appointment_date) {
      setExpectedTime(
        expectedTime.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else if (currentTime.toISOString().split("T")[0] === appointment_date) {
      if (currentTime > availableDate) {
        const adjustedTime = new Date(currentTime.getTime() + queueDelayMinutes * 60000);
        setExpectedTime(
          adjustedTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } else {
        setExpectedTime(
          expectedTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      }
    } else {
      setExpectedTime("N/A");
    }
  }, [appointment_time, queuePosition, appointment_date]);

  return (
    <div>
      <div className="flex justify-between gap-1 rounded-md border-2 px-4 py-2 font-noto">
        <DataList.Root
          orientation={{
            initial: "vertical",
            sm: "horizontal",
          }}
          style={{ gap: ".65rem" }}
          size={{
            initial: "1",
            md: "2",
          }}
        >
          <DataList.Item>
            <DataList.Label minWidth="88px">Patient Name</DataList.Label>
            <DataList.Value>
              <Code variant="ghost">{patientName}</Code>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Age & Gender</DataList.Label>
            <DataList.Value>
              <Code variant="ghost">
                {age} {gender}
              </Code>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Hospital</DataList.Label>
            <DataList.Value>
              <Code variant="ghost">{hospital}</Code>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">
              Mode
            </DataList.Label>
            <DataList.Value>
            <Badge variant="ghost" color="green">
                {appointment_time.mode}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">
              Expected Appointment Time
            </DataList.Label>
            <DataList.Value>
              <Badge variant="ghost" color={appointmentType}>
                {expectedTime}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Appointment Date</DataList.Label>
            <DataList.Value>
              <Badge variant="" color={appointmentType}>
                {appointment_date}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Queue Position</DataList.Label>
            <DataList.Value>
              <Badge variant="" color={appointmentType}>
                {queuePosition}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <div className={`flex flex-row justify-start gap-2 md:hidden`}>
            {appointment_time.mode === "online" ? (
              <div className="flex gap-2">
                <SkipAppointment skipAppointment={skipAppointment} />
                <Button
                  onClick={() => window.open(meetingLink, "_blank", "noopener,noreferrer")}
                >
                  <div className="text-xs">Join Meet</div>
                </Button>
                <SeeDetails
                data={data}
                refetch={refetch}
                otpVerified={true}
              />
              </div>
              ) : (
              <div className="flex gap-2">
                {!otpVerified && (
                  <>
                    <SkipAppointment skipAppointment={skipAppointment} />
                    <OtpModal
                      otpVerified={otpVerified}
                      setOtpVerified={setOtpVerified}
                      id={patientId}
                    />
                  </>
                )}
                {
                  <SeeDetails
                    data={data}
                    refetch={refetch}
                    otpVerified={otpVerified}
                  />
                }
              </div>)}
            </div>
          </DataList.Item>
        </DataList.Root>

        <div className="ml-4 hidden flex-col items-center justify-center gap-2 md:flex md:flex-row">
          {/* <CancelDialog data={data} refetch={refetch} /> */}
          {appointment_time.mode === "online" ? (
              <div className="flex gap-2">
                <SkipAppointment skipAppointment={skipAppointment} />
                <Button
                  onClick={() => window.open(meetingLink, "_blank", "noopener,noreferrer")}
                >
                  <div className="text-xs">Join Meet</div>
                </Button>
                <SeeDetails
                data={data}
                refetch={refetch}
                otpVerified={true}
              />
              </div>
              ) : (
              <div className="flex gap-2">
                {!otpVerified && (
                  <>
                    <SkipAppointment skipAppointment={skipAppointment} />
                    <OtpModal
                      otpVerified={otpVerified}
                      setOtpVerified={setOtpVerified}
                      id={patientId}
                    />
                  </>
                )}
                {
                  <SeeDetails
                    data={data}
                    refetch={refetch}
                    otpVerified={otpVerified}
                  />
                }
              </div>)}
        </div>
      </div>
    </div>
  );
}

export default DoctorQueueCard;
