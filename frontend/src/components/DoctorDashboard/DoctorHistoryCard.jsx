import { Badge, Button, Code, DataList } from "@radix-ui/themes";
import SeeDetails from "./SeeDetails";
import SeeDetailsHistory from "./SeeDetailsHistory";
import { useEffect } from "react";
import useGetPrescription from "../../hooks/useGetPrescription";
function DoctorHistoryCard({ data, refetch, setShowLoader }) {
  const {
    patientName,
    age,
    gender,
    hospital,
    issue,
    issueDetails,
    appointment_time,
    appointment_date,
    queuePosition,
    chosenSlot,
  } = data;
  const appointmentTypes = ["orange", "blue"]; // green for today's appointment, blue for future appointment
  const appointmentType =
    appointment_date ===
    new Date().toLocaleDateString("en-IN").replace(/\//g, "-")
      ? appointmentTypes[0]
      : appointmentTypes[1];

  const {
    isLoading,
    data: prescriptionData,
    error,
    status,
    refetchPrescriptions,
    isFetching,
  } = useGetPrescription(data.appointmentId);

  useEffect(() => {
    if (isLoading || isFetching) {
      setShowLoader(true);
    } else setShowLoader(false);
  }, [isLoading, isFetching]);

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
            <DataList.Label minWidth="88px">Issue</DataList.Label>
            <DataList.Value>
              <Code variant="ghost">{issue}</Code>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Hospital</DataList.Label>
            <DataList.Value>
              <Code variant="ghost">{hospital}</Code>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Mode</DataList.Label>
            <DataList.Value>
              <Badge variant="ghost" color="green">
                {chosenSlot.mode}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Appointment Time</DataList.Label>
            <DataList.Value>
              <Badge variant="ghost" color={appointmentType}>
                {new Date(appointment_time).toLocaleTimeString([] , { hour: '2-digit', minute: '2-digit' })}
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
            <div className="flex items-center justify-start md:hidden">
              <SeeDetailsHistory
                data={data}
                refetch={refetch}
                prescriptionData={prescriptionData}
              />
            </div>
          </DataList.Item>
          {/* <DataList.Item>
            <DataList.Label minWidth="88px">Queue Position</DataList.Label>
            <DataList.Value>
              <Badge variant="" color={appointmentType}>
                {queuePosition}
              </Badge>
            </DataList.Value>
          </DataList.Item> */}
        </DataList.Root>
        <div className="ml-4 hidden items-center justify-center md:flex">
          <SeeDetailsHistory
            data={data}
            refetch={refetch}
            prescriptionData={prescriptionData}
          />
        </div>
      </div>
    </div>
  );
}

export default DoctorHistoryCard;
