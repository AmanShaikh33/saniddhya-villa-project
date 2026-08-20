import { useEffect, useState } from "react";
import { Bell, Calendar, CheckCircle2, Clock, FileText, Download, Navigation, MessageCircle, Phone, ChevronRight, X, Search } from "lucide-react";
import { lookupBookings } from "../services/bookingService";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";
import { useBooking } from "../context/BookingContext";
import toast from "react-hot-toast";

const statusStyles = {
  confirmed: "bg-green-100 text-green-700",
  pending_payment: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const statusLabel = {
  confirmed: "Confirmed",
  pending_payment: "Pending Payment",
  completed: "Completed",
  cancelled: "Cancelled",
};

const MyBookings = () => {
  const { booking } = useBooking();
  const [mobile, setMobile] = useState(booking.guestInfo?.mobile || "");
  const [searched, setSearched] = useState(false);
  const [tab, setTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (mobileToSearch = mobile) => {
    if (!mobileToSearch || mobileToSearch.length < 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await lookupBookings(mobileToSearch, tab);
      setBookings(res.data);
      setSearched(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searched) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (booking.guestInfo?.mobile) {
      handleSearch(booking.guestInfo.mobile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!searched) {
    return (
      <div>
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="font-serif text-2xl font-bold">My Bookings</h1>
          <Bell className="text-navy" size={22} />
        </div>
        <div className="px-4 mt-10 text-center">
          <div className="bg-[#F2E9DC] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="text-navy" size={26} />
          </div>
          <h2 className="font-serif text-xl font-bold mb-2">Find Your Bookings</h2>
          <p className="text-sm text-gray-500 mb-6">Enter the mobile number you used while booking</p>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            maxLength={10}
            className="card w-full text-center text-lg font-semibold outline-none mb-4"
          />
          <button onClick={() => handleSearch()} disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Searching..." : "Find My Bookings"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="font-serif text-2xl font-bold">My Bookings</h1>
        <button onClick={() => setSearched(false)}><X className="text-navy" size={20} /></button>
      </div>

      <div className="flex gap-6 px-4 border-b border-gray-100 mb-4">
        {["upcoming", "past"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-semibold capitalize border-b-2 ${
              tab === t ? "border-navy text-navy" : "border-transparent text-gray-400"
            }`}
          >
            {t === "upcoming" ? "Upcoming" : "Past Bookings"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-navy/60 py-10">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-navy/40 py-10 text-sm">No {tab} bookings found for this number.</p>
      ) : (
        <div className="px-4 space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="card">
              <div className="flex gap-3">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80"
                  alt={b.villa?.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Booking ID</p>
                      <p className="font-bold text-navy text-sm">{b.bookingId}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${statusStyles[b.status]}`}>
                      <CheckCircle2 size={12} /> {statusLabel[b.status]}
                    </span>
                  </div>
                  <p className="font-serif font-bold text-navy mt-1">{b.villa?.name}</p>
                  <p className="text-xs text-gray-500">{b.villa?.city}, {b.villa?.state}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
                <div>
                  <p className="text-xs text-gray-400">Check-in</p>
                  <p className="text-xs font-semibold text-navy">{formatDate(b.checkIn)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Check-out</p>
                  <p className="text-xs font-semibold text-navy">{formatDate(b.checkOut)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Guests</p>
                  <p className="text-xs font-semibold text-navy">{b.guests}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Nights</p>
                  <p className="text-xs font-semibold text-navy">{b.nights}</p>
                </div>
              </div>

              {b.pricing && (
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-teal font-semibold">Advance Paid</p>
                    <p className="font-bold text-navy">{formatCurrency(b.pricing.advanceAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Remaining</p>
                    <p className="font-bold text-navy">{formatCurrency(b.pricing.remainingAmount)}</p>
                  </div>
                </div>
              )}

              {b.status === "confirmed" && (
                <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-100">
                  {[
                    { icon: FileText, label: "View" },
                    { icon: Download, label: "Invoice" },
                    { icon: Navigation, label: "Directions" },
                    { icon: MessageCircle, label: "WhatsApp" },
                  ].map(({ icon: Icon, label }) => (
                    <button key={label} className="flex flex-col items-center gap-1">
                      <span className="bg-[#F2E9DC] rounded-full p-2">
                        <Icon size={16} className="text-navy" />
                      </span>
                      <span className="text-[10px] text-gray-500">{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;