import { apiClient } from './apiClient';

export const eventService = {
  getEvents: (params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient(`/events${query}`, { method: 'GET' });
  },
  getEvent: (id) => apiClient(`/events/${id}`, { method: 'GET' }),
  createEvent: (data) => apiClient('/events/', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent: (id, data) => apiClient(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent: (id) => apiClient(`/events/${id}`, { method: 'DELETE' }),
  
  registerForEvent: (eventId, userId) => apiClient(`/events/${eventId}/register`, { 
    method: 'POST', 
    body: JSON.stringify({ event_id: eventId, user_id: userId, status: 'REGISTERED' }) 
  }),
  
  getEventRegistrations: (eventId, params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient(`/events/${eventId}/registrations${query}`, { method: 'GET' });
  },
  
  updateRegistration: (eventId, registrationId, data) => apiClient(`/events/${eventId}/registrations/${registrationId}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
};
