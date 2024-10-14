import apiClient from './apiClient';

export const createNote = async (notesData) => {
  const response = await apiClient.post('/notes', notesData);
  return response.data || {};
};

export const getNote = async () => {
  const response = await apiClient.get('/notes');
  return response.data || {};
}

export const updateNote = async (notesData) => {
  const response = await apiClient.put('/notes', notesData);
  return response.data || {};
};

export const deleteNote = async (noteId) => {
  const response = await apiClient.delete('/notes', noteId);
  return response.data || {};
};