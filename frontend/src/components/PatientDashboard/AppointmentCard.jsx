import { Badge, Button, Code, DataList } from "@radix-ui/themes";
import CancelDialog from "./CancelDialog";
import { useState, useEffect } from "react";
function AppointmentCard({ data, refetch }) {
  const {
    doctor,
    specialization,
    hospital,
    address,
    appointment_date,
    queuePosition,
    plus_code,
    available_from,
  } = data;
  const appointmentTypes = ["orange", "blue"]; // green for today's appointment, blue for future appointment
  const appointmentType =
    appointment_date ===
    new Date().toLocaleDateString("en-IN").replace(/\//g, "-")
      ? appointmentTypes[0]
      : appointmentTypes[1];

  const [expectedTime, setExpectedTime] = useState(null);

  useEffect(() => {
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
      <div className="flex justify-between gap-y-1 rounded-md border-2 px-4 py-2 font-noto">
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
            <DataList.Label minWidth="88px">Doctor</DataList.Label>
            <DataList.Value>
              <Code variant="ghost">{doctor}</Code>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item align="">
            <DataList.Label minWidth="88px">Specialization</DataList.Label>
            <DataList.Value>
              <Badge color="indigo" variant="soft" radius="small">
                {specialization}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Hospital</DataList.Label>
            <DataList.Value>
              <Code variant="ghost">{hospital}</Code>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Address</DataList.Label>
            <DataList.Value>
              <div className="flex items-center gap-x-2">
                <Code variant="ghost">{address}</Code>
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
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Expected Time</DataList.Label>
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
            <div className="flex items-center justify-start md:hidden">
              <CancelDialog data={data} refetch={refetch} />
            </div>
          </DataList.Item>
        </DataList.Root>
        <div className="ml-4 hidden items-center justify-center md:flex">
          <CancelDialog data={data} refetch={refetch} />
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
