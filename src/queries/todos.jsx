import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as todosApi from "../apis/todos";

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => todosApi.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};

export const useGetTodo = (search) => {
  return useQuery({
    queryKey: ["todos", search],
    queryFn: () => todosApi.getTodo(search),
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => todosApi.updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => todosApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
