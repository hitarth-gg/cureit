import { useQuery } from "@tanstack/react-query";
import { getHistoryForDoctor } from "../utils/api";
export default function useGetHistoryForDoctor(doctorId) {
  const { isLoading, data, error, status, refetch, isFetching } = useQuery({
    queryKey: ["doctor_queue_history", doctorId],
    queryFn: () => {
      if (doctorId) return getHistoryForDoctor(doctorId);
      return null;
    },
    staleTime: 1000 * 20, // 20 second
  });
  return { isLoading, data, error, status, refetch, isFetching };
}