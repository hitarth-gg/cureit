import { toast } from "sonner";
import useGetHistoryAppointment from "../hooks/useGetHistoryAppointment";
import HistoryAppointmentCard from "./HistoryAppointmentCard";
import Loader from "./Loader";
function HistoryAppointments() {
  const patientId = 123;
  const { isLoading, data, error, status, refetch, isFetching } =
    useGetHistoryAppointment(patientId);



  if (error) {
    toast.error("Error fetching data");
  }

  return (
    <div>
      <div className="">
        {(isLoading || isFetching) && <Loader />}
        <div className="flex flex-col gap-4">
          {data?.map((appointment, ix) => (
            <HistoryAppointmentCard
              key={ix + "history"}
              data={appointment}
              refetch={refetch}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HistoryAppointments;
