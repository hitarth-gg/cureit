import { Badge, Button, Code, DataList } from "@radix-ui/themes";
import SeeDetails from "./SeeDetails";
import useGetPrescription from "../../hooks/useGetPrescription";
import { useEffect } from "react";
function HistoryAppointmentCard({ data, refetch , setShowLoader }) {
  console.log("HistoryAppointmentCard data: ", data);
  const {
    doctor,
    specialization,
    hospital,
    appointment_time,
    appointment_date,
  } = data;

  const { isLoading, data: prescriptionData, error, status, refetchPrescriptions, isFetching } =
      useGetPrescription(data.appointmentId);
  
    useEffect(()=>{
      if(isLoading || isFetching){
        setShowLoader(true);
      }
        else
        setShowLoader(false);
    } , [isLoading, isFetching]);
  
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
              <Badge variant="ghost">{appointment_time}</Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Appointment Date</DataList.Label>
            <DataList.Value>
              <Badge variant="">{appointment_date}</Badge>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>
        <div className="ml-4 flex items-center justify-center">
          <SeeDetails data={data} refetch={refetch} prescriptionData={prescriptionData} />
        </div>
      </div>
    </div>
  );
}

export default HistoryAppointmentCard;
