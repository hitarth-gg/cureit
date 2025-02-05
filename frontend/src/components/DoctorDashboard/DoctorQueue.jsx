import { toast } from "sonner";
import Loader from "../Loader";
import useGetQueueForDoctor from "../../hooks/useGetQueueForDoctor";
import DoctorQueueCard from "./DoctorQueueCard";

function DoctorQueue() {
  const doctorId = "1fbbdc70-f8b5-49a5-ad46-4ed7c24dbdb3";
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
      </div>
    </div>
  );
}

export default DoctorQueue;
