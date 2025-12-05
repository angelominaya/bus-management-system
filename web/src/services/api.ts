import axios from 'axios';
import type { Bus, BusRoute, Schedule, Reservation } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const busService = {
  getAll: () => api.get<Bus[]>('/buses').then(res => res.data),
  getById: (id: number) => api.get<Bus>(`/buses/${id}`).then(res => res.data),
  create: (bus: Omit<Bus, 'id'>) => api.post<Bus>('/buses', bus).then(res => res.data),
  update: (id: number, bus: Bus) => api.put(`/buses/${id}`, bus),
  delete: (id: number) => api.delete(`/buses/${id}`),
};

export const routeService = {
  getAll: () => api.get<BusRoute[]>('/bus-routes').then(res => res.data),
  getById: (id: number) => api.get<BusRoute>(`/bus-routes/${id}`).then(res => res.data),
  create: (route: Omit<BusRoute, 'id'>) => api.post<BusRoute>('/bus-routes', route).then(res => res.data),
  update: (id: number, route: BusRoute) => api.put(`/bus-routes/${id}`, route),
  delete: (id: number) => api.delete(`/bus-routes/${id}`),
};

export const scheduleService = {
  getAll: () => api.get<Schedule[]>('/schedules').then(res => res.data),
  getById: (id: number) => api.get<Schedule>(`/schedules/${id}`).then(res => res.data),
  create: (schedule: Omit<Schedule, 'id' | 'bus' | 'route'>) => api.post<Schedule>('/schedules', schedule).then(res => res.data),
  update: (id: number, schedule: Schedule) => api.put(`/schedules/${id}`, schedule),
  delete: (id: number) => api.delete(`/schedules/${id}`),
};

export const reservationService = {
  getAll: () => api.get<Reservation[]>('/reservations').then(res => res.data),
  getById: (id: number) => api.get<Reservation>(`/reservations/${id}`).then(res => res.data),
  create: (reservation: Omit<Reservation, 'id' | 'schedule'>) => api.post<Reservation>('/reservations', reservation).then(res => res.data),
  delete: (id: number) => api.delete(`/reservations/${id}`),
};
