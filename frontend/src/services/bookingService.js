import api from "./api";

export const createBooking = (payload) => api.post("/bookings", payload);

export const getBooking = (bookingId) => api.get(`/bookings/${bookingId}`);

export const updateGuestDetails = (bookingId, payload) =>
  api.patch(`/bookings/${bookingId}/guest-details`, payload);

export const uploadGovtId = (bookingId, formData) =>
  api.post(`/bookings/${bookingId}/guest-id`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const lookupBookings = (mobile, status) =>
  api.get("/bookings/lookup", { params: { mobile, status } });

export const cancelBooking = (bookingId) => api.patch(`/bookings/${bookingId}/cancel`);