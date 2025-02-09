import { useMutation , useQueryClient } from "@tanstack/react-query";
import { putPrescription } from "../utils/api";
export default function usePutPrescription() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: putPrescription,
        onSuccess: (data) => {
            console.log("Prescription updated successfully");
            queryClient.invalidateQueries({ queryKey: ['prescription'] });
        },
        onError: (error) => {
            console.log("Error updating prescription", error);
        }
    }
    )
    return { mutate };
}
