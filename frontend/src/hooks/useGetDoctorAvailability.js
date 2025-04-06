import { useQuery } from "@tanstack/react-query";
import { getDoctorAvailability } from "../utils/api";
export default function useGetDoctorAvailability(doctorId) {
    const { isLoading, data, error, status, refetch, isFetching } = useQuery({
        queryKey: ["doctor_availability", doctorId],
        queryFn: () => {
        return getDoctorAvailability(doctorId);
        },
        staleTime: 1000 * 100,
        enabled: Boolean(doctorId),
    });
    return { isLoading, data, error, status, refetch, isFetching };
}