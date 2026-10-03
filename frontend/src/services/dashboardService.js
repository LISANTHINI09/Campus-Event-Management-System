import api from './api';

export const dashboardService = {
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getStudentDashboard: async (studentId) => {
    const response = await api.get(`/dashboard/student/${studentId}`);
    return response.data;
  },
};
