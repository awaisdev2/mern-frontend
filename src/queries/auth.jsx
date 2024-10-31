import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify"; 

import * as authApi from "../apis/auth";

export const useUserLogin = () => {
  return useMutation({
    mutationFn: (credentials) => authApi.loginUser(credentials),
    onError: (err) => toast.error(err.message)
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: (credentials) => authApi.registerUser(credentials),
    onError: (err) => toast.error(err.message)
  });
};
