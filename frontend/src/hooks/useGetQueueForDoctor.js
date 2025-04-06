import { useQuery } from "@tanstack/react-query";
import { getQueueForDoctor } from "../utils/api";

export default function useGetQueueForDoctor(doctorId, selectedDate, selectedSlot) {
  const formattedDate = selectedDate?.toISOString().split("T")[0];

  const { isLoading, data, error, status, refetch, isFetching } = useQuery({
    queryKey: ["doctor_queue", doctorId, formattedDate, selectedSlot?.start_time, selectedSlot?.end_time],
    queryFn: () => {
      if (doctorId && formattedDate && selectedSlot) {
        return getQueueForDoctor(doctorId, formattedDate, selectedSlot);
      }
      return null;
    },
    enabled: !!doctorId && !!formattedDate && !!selectedSlot,
    staleTime: 1000 * 20, // 20 seconds
  });

  return { isLoading, data, error, status, refetch, isFetching };
}
