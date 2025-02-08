import { useQuery } from "@tanstack/react-query";
import { getDoctorProfileDetails, getDoctorSlots } from "../utils/api";
// export default function useGetDoctorSlots(doctorId, accessToken) {
//   const { isLoading, data, error, status, refetch, isFetching } = useQuery({
//     queryKey: ["doctor_details", doctorId],
//     queryFn: () => {
//       // if(doctorType.formData.selectedDate==null || doctorType.dataDoctorType==null || doctorType.patientId==null )
//       if (doctorId == null) {
//         console.log("DoctorId is NULL");
//         return null;
//       } else {
//         const date = doctorType.formData.selectedDate
//           .split("-")
//           .reverse()
//           .join("-");
//         return getDoctorSlots(
//           date,
//           doctorType.dataDoctorType,
//           doctorType.patientId,
//         );
//       }
//     },
//     staleTime: 1000 * 1, // 1 second
//     enabled: doctorType !== null,
//   });
//   return { isLoading, data, error, status, refetch, isFetching };
// }

export default function useGetDoctorDetails(doctorId, accessToken) {
  console.log("ingetdoctordetails");
  const { isLoading, data, error, status, refetch, isFetching } = useQuery({
    queryKey: ["DoctorDetails", doctorId],
    queryFn: () => {
      return getDoctorProfileDetails(doctorId, accessToken);
      //   return null;
    },
    staleTime: 1000 * 1, // 1 second
    // enabled: Boolean(doctorId),
  });
  return { isLoading, data, error, status, refetch, isFetching };
}
