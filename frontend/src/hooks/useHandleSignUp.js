//use mutations
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAppointment, signUpNewUser } from "../utils/api";
export default function useHandleSignUp(signUpData) {
  //   const queryClient = useQueryClient(signUpData);
  const mutate = useMutation({
    mutationFn: (data) => {
      return signUpNewUser(data);
    },

    onSuccess: (data) => {
      console.log("User signed up successfully");
      return data;
    },
    onError: (error) => {
      console.log("Error signing up", error);
    },
  });
  return { mutate };
}
