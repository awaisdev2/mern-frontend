import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import * as usersApi from "../apis/user";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({userId, data}) => usersApi.updateUserProfile(userId, data),
    onSuccess: () => toast.success("Profile updated successfully!"),
    onError: (error) => toast.error(error.message),
  });
};
