import { useQuery } from "@tanstack/react-query";
import { getDoctorSlots } from "../utils/api";
export default function useGetDoctorSlots(doctorType) {
  const { isLoading, data, error, status, refetch, isFetching } = useQuery({
    queryKey: ["doctor_slots", doctorType],
    queryFn: () => {
      if (doctorType) return getDoctorSlots(doctorType);
      return null;
    },
    staleTime: 1000 * 1, // 1 second
  });
  return { isLoading, data, error, status, refetch, isFetching };
}