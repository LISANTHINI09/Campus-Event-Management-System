import api from './api';

export const registrationService = {
  registerForEvent: async (dataOrStudentId, eventId) => {
    let payload;
    if (typeof dataOrStudentId === 'object' && dataOrStudentId !== null) {
      payload = dataOrStudentId;
    } else {
      payload = { studentId: dataOrStudentId, eventId };
    }
    const response = await api.post('/registrations', payload);
    return response.data;
  },

  getMyRegistrations: async (studentId) => {
    const response = await api.get(`/registrations/student/${studentId}`);
    return response.data;
  },

  getEventRegistrations: async (eventId) => {
    const response = await api.get(`/registrations/event/${eventId}`);
    return response.data;
  },

  getAllRegistrations: async () => {
    const response = await api.get('/registrations');
    return response.data;
  },

  cancelRegistration: async (id) => {
    const response = await api.delete(`/registrations/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/registrations/${id}/status`, { status });
    return response.data;
  },
};
