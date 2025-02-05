import { toast } from "sonner";
import Loader from "../Loader";
import useGetQueueForDoctor from "../../hooks/useGetQueueForDoctor";
import DoctorHistoryCard from "./DoctorHistoryCard";
import useGetHistoryForDoctor from "../../hooks/useGetHistoryForDoctor";

function DoctorHistory() {
  const doctorId = "1fbbdc70-f8b5-49a5-ad46-4ed7c24dbdb3";
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
