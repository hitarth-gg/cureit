import { useQuery } from "@tanstack/react-query";
import { getDoctorSlots } from "../utils/api";
export default function useGetDoctorSlots(doctorType) {
  const { isLoading, data, error, status, refetch, isFetching } = useQuery({
    queryKey: ["doctor_slots", doctorType],
    queryFn: () => {
   if(doctorType==null)
    {
      return null;
    }
    else
    {
      const date = doctorType.formData.selectedDate.split("-").reverse().join("-");
      return getDoctorSlots(date, doctorType.dataDoctorType, doctorType.patientId , doctorType.mode);
    }},
    staleTime: 1000 * 1, // 1 second
    enabled: doctorType !== null,
  });
  return { isLoading, data, error, status, refetch, isFetching };
}
