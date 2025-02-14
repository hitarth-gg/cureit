import { useQuery } from "@tanstack/react-query";
import { getDoctorSlots } from "../utils/api";
export default function useGetDoctorSlots(doctorType) {
  const { isLoading, data, error, status, refetch, isFetching } = useQuery({
    queryKey: ["doctor_slots", doctorType],
    queryFn: () => {
    // if(doctorType.formData.selectedDate==null || doctorType.dataDoctorType==null || doctorType.patientId==null )
    if(doctorType==null)
    {
      // console.log("Null returned slots");
      return null;
    }
    else
    {
      const date = doctorType.formData.selectedDate.split("-").reverse().join("-");
      return getDoctorSlots(date, doctorType.dataDoctorType, doctorType.patientId);
    }},
    staleTime: 1000 * 1, // 1 second
    enabled: doctorType !== null,
  });
  return { isLoading, data, error, status, refetch, isFetching };
}
