import { toast } from "sonner";
import Loader from "../Loader";
import useGetQueueForDoctor from "../../hooks/useGetQueueForDoctor";
import DoctorHistoryCard from "./DoctorHistoryCard";
import useGetHistoryForDoctor from "../../hooks/useGetHistoryForDoctor";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../utils/ContextProvider";
function DoctorHistory() {
  const user = useAuthContext();
    const [doctorId, setDoctorId] = useState(null);
    useEffect(()=>{
      if(user.currentUser!=null){
        setDoctorId (user.currentUser.id);
        console.log(user.currentUser.id)
      } },[user])
  const { isLoading, data, error, status, refetch, isFetching } =
    useGetHistoryForDoctor(doctorId);

  if (error) {
    toast.error("Error fetching data");
  }

  return (
    <div className="">
      {(isLoading || isFetching) && <Loader />}
      <div className="flex flex-col gap-4">
        {data?.map((queue, ix) => (
          <DoctorHistoryCard key={ix} data={queue} refetch={refetch} />
        ))}
      </div>
    </div>
  );
}

export default DoctorHistory;
