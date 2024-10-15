import apiClient from "./apiClient";

export const createTodo = async (todosData) => {
  const response = await apiClient.post("/todos", todosData);
  return response.data || {};
};

export const getTodo = async (search) => {
  const response = await apiClient.get("/todos", {params: {search: search}});
  return response.data || {};
};

export const updateTodo = async (todoId, todosData) => {
  const response = await apiClient.put(`/todos/${todoId}`, todosData);
  return response.data || {};
};

export const deleteTodo = async (todoId) => {
  const response = await apiClient.delete(`/todos/${todoId}`);
  return response.data || {};
};
