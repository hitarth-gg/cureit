import { useQuery } from "@tanstack/react-query";
import { getDoctorSlots, getDoctorType } from "../utils/api";

export default function useGetDoctorType(healthIssue) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ["doctor_type", healthIssue],
    queryFn: () => {
      if (healthIssue !== null) return getDoctorType(healthIssue);
        // console.log("Null returned type");
        return null;
    },
    staleTime: 1000 * 1, // 1 second
  });

  return { isLoading, data, error, status };
}
