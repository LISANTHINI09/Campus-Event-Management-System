import api from './api';

export const studentService = {
  login: async (credentials) => {
    const response = await api.post('/students/login', credentials);
    return response.data;
  },

  register: async (studentData) => {
    const response = await api.post('/students/register', studentData);
    return response.data;
  },

  getProfile: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  updateProfile: async (id, updateData) => {
    const response = await api.put(`/students/${id}`, updateData);
    return response.data;
  },

  getAllStudents: async () => {
    const response = await api.get('/students');
    return response.data;
  },
};
