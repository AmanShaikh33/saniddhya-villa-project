import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { BookingProvider } from "./context/BookingContext";
import BottomNav from "./components/common/BottomNav";
import Home from "./pages/Home";
import VillaDetails from "./pages/VillaDetails";
import Gallery from "./pages/Gallery";
import CheckAvailability from "./pages/CheckAvailability";
import GuestDetails from "./pages/GuestDetails";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";
import Location from "./pages/Location";
import Rules from "./pages/Rules";
import Profile from "./pages/Profile";

function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<VillaDetails />} />
            <Route path="/villa/:id" element={<VillaDetails />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/check-availability" element={<CheckAvailability />} />
            <Route path="/guest-details" element={<GuestDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/location" element={<Location />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <BottomNav />
        </div>
        <Toaster position="top-center" />
      </BrowserRouter>
    </BookingProvider>
  );
}

export default App;