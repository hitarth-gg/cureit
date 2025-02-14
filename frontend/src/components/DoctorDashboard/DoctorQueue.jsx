import { toast } from "sonner";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import useGetQueueForDoctor from "../../hooks/useGetQueueForDoctor";
import DoctorQueueCard from "./DoctorQueueCard";
import { useAuthContext } from "../../utils/ContextProvider";
function DoctorQueue() {
  const user = useAuthContext();
  const [doctorId, setDoctorId] = useState(null);
  useEffect(() => {
    if (user.currentUser != null) {
      setDoctorId(user.currentUser.id);
      // console.log(user.currentUser.id);
    }
  }, [user]);
  const { isLoading, data, error, status, refetch, isFetching } =
    useGetQueueForDoctor(doctorId);

  if (error) {
    toast.error("Error fetching data");
  }

  return (
    <div className="">
      {(isLoading || isFetching) && <Loader />}
      <div className="flex flex-col gap-4">
        {data?.map((queue, ix) => (
          <DoctorQueueCard key={ix} data={queue} refetch={refetch} />
        ))}
        {data?.length === 0 && (
          <div className="text-center">No appointments to show!</div>
        )}
      </div>
    </div>
  );
}

export default DoctorQueue;
