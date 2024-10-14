import apiClient from "./apiClient";

export const createExpense = async (expensesData) => {
  const response = await apiClient.post("/expenses", expensesData);
  return response.data || {};
};

export const getExpense = async (search) => {
  const response = await apiClient.get("/expenses", {params: {search: search}});
  return response.data || {};
};

export const updateExpense = async (id, expensesData) => {
  const response = await apiClient.put(`/expenses/${id}`, expensesData);
  return response.data || {};
};

export const deleteExpense = async (expenseId) => {
  const response = await apiClient.delete(`/expenses/${expenseId}`);
  return response.data || {};
};
