import { Badge, Button, Code, DataList, DropdownMenu } from "@radix-ui/themes";
import SeeDetails from "./SeeDetails";
import { useState, useEffect } from "react";
import OtpModal from "./OtpModal";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import SkipAppointment from "./SkipAppointment";

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
  } = data;
  const [otpVerified, setOtpVerified] = useState(false);

  const appointmentTypes = ["orange", "blue"]; // green for today's appointment, blue for future appointment
  const appointmentType =
    appointment_date ===
    new Date().toLocaleDateString("en-IN").replace(/\//g, "-")
      ? appointmentTypes[0]
      : appointmentTypes[1];

  const [expectedTime, setExpectedTime] = useState("");

  useEffect(() => {
    // console.log("DoctorQueueCard data: ", data);

    if (
      available_from === "N/A" ||
      queuePosition === "N/A" ||
      isNaN(queuePosition) ||
      appointment_date === "N/A"
    ) {
      setExpectedTime("N/A");
    } else {
      let availableTime = available_from;
      if (availableTime && !availableTime.includes("T")) {
        availableTime = `${appointment_date}T${availableTime}`;
      }

      const availableDate = new Date(availableTime);
      const currentTime = new Date();
      const availableTimeWithQueue = new Date(
        availableDate.getTime() + (Number(queuePosition) - 1) * 15 * 60000,
      );
      const currentTimeWithQueue = new Date(
        currentTime.getTime() + (Number(queuePosition) - 1) * 15 * 60000,
      );
      if (currentTime.toISOString().split("T")[0] < appointment_date) {
        setExpectedTime(
          availableTimeWithQueue.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      } else if (currentTime.toISOString().split("T")[0] === appointment_date) {
        if (currentTime > availableDate) {
          setExpectedTime(
            currentTimeWithQueue.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          );
        } else {
          setExpectedTime(
            availableTimeWithQueue.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          );
        }
      } else {
        setExpectedTime(
          availableTimeWithQueue.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      }
    }
  }, [available_from, queuePosition, appointment_date]);

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
          {/* <DataList.Item>
            <DataList.Label minWidth="88px">Issue</DataList.Label>
            <DataList.Value>
              <Code variant="ghost">{issue}</Code>
            </DataList.Value>
          </DataList.Item> */}
          <DataList.Item>
            <DataList.Label minWidth="88px">Hospital</DataList.Label>
            <DataList.Value>
              <Code variant="ghost">{hospital}</Code>
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
              <div className="flex gap-2">
                {
                  <OtpModal
                    otpVerified={otpVerified}
                    setOtpVerified={setOtpVerified}
                  />
                }
                {
                  <SeeDetails
                    data={data}
                    refetch={refetch}
                    otpVerified={otpVerified}
                  />
                }
              </div>
            </div>
          </DataList.Item>
        </DataList.Root>

        <div className="ml-4 hidden flex-col items-center justify-center gap-2 md:flex md:flex-row">
          {/* <CancelDialog data={data} refetch={refetch} /> */}
          <SkipAppointment />
          {!otpVerified && (
            <OtpModal
              otpVerified={otpVerified}
              setOtpVerified={setOtpVerified}
              id={patientId}
            />
          )}
          <SeeDetails data={data} refetch={refetch} otpVerified={otpVerified} />
        </div>
      </div>
    </div>
  );
}

export default DoctorQueueCard;
