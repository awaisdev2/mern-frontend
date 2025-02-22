import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as notesApi from "../apis/notes";

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => notesApi.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    }
  });
};

export const useGetNote = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: () => notesApi.getNote(),
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, data}) => notesApi.updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    }
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notesApi.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    }
  });
};
