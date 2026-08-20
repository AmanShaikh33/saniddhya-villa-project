import api from "./api";

export const getVilla = (villaId) => api.get(`/villas/${villaId}`);

export const getMonthAvailability = (villaId, month, year) =>
  api.get(`/villas/${villaId}/availability`, { params: { month, year } });

export const checkAvailability = (villaId, checkIn, checkOut) =>
  api.post(`/villas/${villaId}/availability/check`, { checkIn, checkOut });