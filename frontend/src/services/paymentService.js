import api from "./api";

export const createPaymentOrder = (bookingId, purpose = "advance") =>
  api.post("/payments/create-order", { bookingId, purpose });

export const verifyPayment = (payload) => api.post("/payments/verify", payload);