import { useQuery } from "@tanstack/react-query";
import { getQueueForDoctor } from "../utils/api";

export default function useGetQueueForDoctor(doctorId) {
  const { isLoading, data, error, status, refetch, isFetching } = useQuery({
    queryKey: ["doctor_slots", doctorId],
    queryFn: () => {
      if (doctorId) return getQueueForDoctor(doctorId);
      return null;
    },
    staleTime: 1000 * 1, // 1 second
  });

  return { isLoading, data, error, status, refetch, isFetching };
}
