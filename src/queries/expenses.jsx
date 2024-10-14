import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as expensesApi from "../apis/expenses";

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => expensesApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
  });
};

export const useGetExpenses = (search) => {
  return useQuery({
    queryKey: ["expenses", search],
    queryFn: () => expensesApi.getExpense(search),
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data}) => expensesApi.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => expensesApi.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
  });
};
