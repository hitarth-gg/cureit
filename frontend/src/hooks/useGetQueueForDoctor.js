import { useQuery } from "@tanstack/react-query";
import { getQueueForDoctor } from "../utils/api";

export default function useGetQueueForDoctor(doctorId) {
  const { isLoading, data, error, status, refetch, isFetching } = useQuery({
    queryKey: ["doctor_queue", doctorId],
    queryFn: () => {
      if (doctorId) return getQueueForDoctor(doctorId);
      return null;
    },
    staleTime: 1000 * 20, // 20 second
  });

  return { isLoading, data, error, status, refetch, isFetching };
}
