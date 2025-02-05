import { useQuery } from "@tanstack/react-query";
import { getDoctorSlots, getDoctorDetails } from "../utils/api";

export default function useGetDoctorType(data2) {
  const { isLoading, data, error, status } = useQuery({
    queryKey: ["doctor_type", data2],
    queryFn: () => {
      if (data2 !== null) return getDoctorDetails(data2);
        console.log("Null returned type");
        return null;
    },
    staleTime: 1000 * 1, // 1 second
  });

  return { isLoading, data, error, status };
}
