import { Badge, Button, Code, DataList } from "@radix-ui/themes";
import CancelDialog from "./CancelDialog";

function AppointmentCard({ data, refetch }) {
  const {
    doctor,
    specialization,
    hospital,
    appointment_time,
    appointment_date,
    queuePosition,
  } = data;
  const appointmentTypes = ["orange", "blue"]; // green for today's appointment, blue for future appointment
  const appointmentType =
    appointment_date ===
    new Date().toLocaleDateString("en-IN").replace(/\//g, "-")
      ? appointmentTypes[0]
      : appointmentTypes[1];

  return (
    <div>
      <div className="flex justify-between gap-y-1 rounded-md border-2 px-4 py-2 font-noto">
        <DataList.Root
          orientation={"horizontal"}
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
          <DataList.Item align="center">
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
            <DataList.Label minWidth="88px">Appointment Time</DataList.Label>
            <DataList.Value>
              <Badge variant="ghost" color={appointmentType}>{appointment_time}</Badge>
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
        </DataList.Root>
        <div className="ml-4 flex items-center justify-center">
          <CancelDialog data={data} refetch={refetch} />
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
