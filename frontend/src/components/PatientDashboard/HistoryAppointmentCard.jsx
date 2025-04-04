import { Badge, Button, Code, DataList } from "@radix-ui/themes";
import SeeDetails from "./SeeDetails";
import useGetPrescription from "../../hooks/useGetPrescription";
import { useEffect } from "react";
import Feedback from "./Feedback";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
function HistoryAppointmentCard({ data, refetch, setShowLoader }) {
  // console.log("HistoryAppointmentCard data: ", data);
  const {
    doctor,
    specialization,
    hospital,
    appointment_time,
    chosenSlot,
    appointment_date,
    plus_code,
    address,
  } = data;

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
              <Badge variant="ghost">
                {new Date(appointment_time).toLocaleTimeString([], {
                  // timeZone: "Asia/Kolkata",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Appointment Date</DataList.Label>
            <DataList.Value>
              <Badge variant="">{appointment_date}</Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <div className="flex items-center justify-start gap-x-2 md:hidden">
              <Feedback />
              
              {data?.status === "completed" && (
                <SeeDetails
                  data={data}
                  refetch={refetch}
                  prescriptionData={prescriptionData}
                />
              )}
              {data?.status === "missed" && (
                <div className="flex items-center justify-center gap-x-2 rounded-sm border-2 border-orange-500 px-3 py-[6px] text-orange-500">
                  Missed
                  <ExclamationTriangleIcon />
                </div>
              )}
            </div>
          </DataList.Item>
        </DataList.Root>
        <div className="ml-4 hidden items-center justify-center gap-x-2 md:flex">
          <Feedback data={data} />
          {data?.status === "completed" && (
            <SeeDetails
              data={data}
              refetch={refetch}
              prescriptionData={prescriptionData}
            />
          )}
          {data?.status === "missed" && (
            <div className="flex items-center justify-center gap-x-2 rounded-[4px] select-none border-2 border-orange-500 px-3 py-[5px] text-orange-500">
              Missed
              <ExclamationTriangleIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryAppointmentCard;
