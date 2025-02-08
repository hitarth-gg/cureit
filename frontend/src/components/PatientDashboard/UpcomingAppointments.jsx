import { toast } from "sonner";
import useGetUpcomingAppointments from "../../hooks/useGetUpcomingAppointments";
import AppointmentCard from "./AppointmentCard";
import Loader from "../Loader";
import { useAuthContext } from "../../utils/ContextProvider";
import { useEffect, useState } from "react";
function UpcomingAppointments() {
  const user = useAuthContext();
  const [patientId, setPatientId] = useState(null);
  useEffect(()=>{
    if(user.currentUser!=null){
      setPatientId (user.currentUser.id);
      console.log(user.currentUser.id)
    } },[user])
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
