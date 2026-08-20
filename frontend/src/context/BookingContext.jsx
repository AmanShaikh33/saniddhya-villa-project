import { createContext, useContext, useState } from "react";

const BookingContext = createContext(null);

const initialState = {
  villaId: null,
  checkIn: null,
  checkOut: null,
  guests: 2,
  nights: 0,
  bookingId: null,
  bookingCode: null,
  pricing: null,
  guestInfo: null,
};

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState(initialState);

  const updateBooking = (updates) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const resetBooking = () => setBooking(initialState);

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within a BookingProvider");
  return ctx;
};