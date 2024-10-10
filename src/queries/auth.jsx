import { useMutation } from "@tanstack/react-query";

import * as authApi from "../apis/auth";

export const useUserLogin = () => {
  return useMutation({
    mutationFn: (credentials) => authApi.loginUser(credentials),
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: (credentials) => authApi.registerUser(credentials),
  });
};
