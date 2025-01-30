import { toast } from "sonner";
import useGetUpcomingAppointments from "../hooks/useGetUpcomingAppointments";
import AppointmentCard from "./AppointmentCard";
import Loader from "./Loader";

function UpcomingAppointments() {
  const patientId = 123;
  const { isLoading, data, error, status, refetch, isFetching } =
    useGetUpcomingAppointments(patientId);

    if (error) {
        toast.error("Error fetching data");
      }

  return (
    <div className="">
      {(isLoading || isFetching) && <Loader />}
      <div className="flex flex-col gap-4">
        {data?.map((appointment, ix) => (
          <AppointmentCard key={ix} data={appointment} refetch={refetch} />
        ))}
      </div>
    </div>
  );
}

export default UpcomingAppointments;
