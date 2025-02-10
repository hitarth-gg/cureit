import { useQueryClient , useMutation } from "@tanstack/react-query";
import { postAppointmentStatus } from "../utils/api";
import {toast} from "sonner";
export default function usePostAppointmentStatus() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: postAppointmentStatus,
        onSuccess: (data) => {
            console.log("Appointment status updated successfully");
            toast.success("Appointment status updated successfully");
            queryClient.invalidateQueries({ queryKey: ['patient_appointment_history'] });
            queryClient.invalidateQueries({ queryKey: ['doctor_queue_history'] });
            queryClient.invalidateQueries({ queryKey: ['doctor_queue'] });
        },
        onError: (error) => {
            console.log("Error updating appointment status", error);
        }
    }
    )
    return { mutate };
}