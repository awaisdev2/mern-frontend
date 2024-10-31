import apiClient from "./apiClient";

export const updateUserProfile = async (userId, data) => {
  const response = await apiClient.put(`/user/${userId}`, data);
  return response.data || {};
};
