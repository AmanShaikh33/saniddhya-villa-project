import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar, Users, Briefcase, ArrowRight, Shield } from "lucide-react";
import { getVilla, getMonthAvailability } from "../services/villaService";
import { createBooking } from "../services/bookingService";
import { useBooking } from "../context/BookingContext";
import { dateToISO, dayName } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import toast from "react-hot-toast";

const VILLA_ID = import.meta.env.VITE_VILLA_ID;

const CheckAvailability = () => {
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();

  const [villa, setVilla] = useState(null);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [dayStatus, setDayStatus] = useState({}); // { "2026-07-17": "blocked" }
  const [selecting, setSelecting] = useState({ checkIn: null, checkOut: null });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    getVilla(VILLA_ID).then((res) => setVilla(res.data));
  }, []);

  useEffect(() => {
    getMonthAvailability(VILLA_ID, viewMonth, viewYear).then((res) => {
      const map = {};
      res.data.forEach((r) => {
        map[dateToISO(r.date)] = r.status;
      });
      setDayStatus(map);
    });
  }, [viewMonth, viewYear]);

  const changeMonth = (delta) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m > 12) { m = 1; y += 1; }
    if (m < 1) { m = 12; y -= 1; }
    setViewMonth(m);
    setViewYear(y);
  };

  const monthLabel = new Date(viewYear, viewMonth - 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  // Build calendar grid (Mon-start week)
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth - 1, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewMonth, viewYear]);

  const getStatusForDay = (day) => {
    const iso = dateToISO(new Date(viewYear, viewMonth - 1, day));
    return dayStatus[iso] || "available";
  };

  const isSelected = (day) => {
    const iso = dateToISO(new Date(viewYear, viewMonth - 1, day));
    if (selecting.checkIn && iso === dateToISO(selecting.checkIn)) return "checkin";
    if (selecting.checkOut && iso === dateToISO(selecting.checkOut)) return "checkout";
    if (selecting.checkIn && selecting.checkOut) {
      const d = new Date(viewYear, viewMonth - 1, day);
      if (d > selecting.checkIn && d < selecting.checkOut) return "inrange";
    }
    return null;
  };

  const handleDayClick = (day) => {
    const status = getStatusForDay(day);
    if (status !== "available") return;

    const clicked = new Date(viewYear, viewMonth - 1, day);

    if (!selecting.checkIn || (selecting.checkIn && selecting.checkOut)) {
      setSelecting({ checkIn: clicked, checkOut: null });
    } else {
      if (clicked <= selecting.checkIn) {
        setSelecting({ checkIn: clicked, checkOut: null });
      } else {
        setSelecting({ checkIn: selecting.checkIn, checkOut: clicked });
      }
    }
  };

  const nights =
    selecting.checkIn && selecting.checkOut
      ? Math.round((selecting.checkOut - selecting.checkIn) / (1000 * 60 * 60 * 24))
      : 0;

  const pricing = useMemo(() => {
    if (!villa || !nights) return null;
    const villaCharges = villa.pricePerNight * nights;
    const taxAmount = Math.round((villaCharges * villa.taxPercent) / 100);
    return {
      villaCharges,
      taxAmount,
      total: villaCharges + taxAmount,
    };
  }, [villa, nights]);

  const handleClear = () => setSelecting({ checkIn: null, checkOut: null });

  const handleContinue = async () => {
    if (!selecting.checkIn || !selecting.checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    setCreating(true);
    try {
      const res = await createBooking({
        villaId: VILLA_ID,
        checkIn: dateToISO(selecting.checkIn),
        checkOut: dateToISO(selecting.checkOut),
        guests: booking.guests || 2,
      });
      updateBooking({
        villaId: VILLA_ID,
        checkIn: selecting.checkIn,
        checkOut: selecting.checkOut,
        nights,
        bookingId: res.data._id,
        bookingCode: res.data.bookingId,
        pricing: res.data.pricing,
      });
      navigate("/guest-details");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={() => navigate(-1)}><ChevronLeft className="text-navy" size={22} /></button>
        <h1 className="font-serif text-xl font-semibold">Check Availability</h1>
        <div className="w-6" />
      </div>

      {villa && (
        <div className="card mx-4 flex gap-3 items-center">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80"
            alt={villa.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <p className="font-serif font-bold text-navy">{villa.name}</p>
            <p className="text-xs text-gray-500">{villa.city}, {villa.state}</p>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="card mx-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)}><ChevronLeft size={18} className="text-navy" /></button>
          <p className="font-serif font-semibold text-navy">{monthLabel}</p>
          <button onClick={() => changeMonth(1)}><ChevronRight size={18} className="text-navy" /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((d) => (
            <div key={d} className="text-center text-xs text-gray-400">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (!day) return <div key={i} />;
            const status = getStatusForDay(day);
            const sel = isSelected(day);

            let classes = "aspect-square rounded-lg flex items-center justify-center text-sm cursor-pointer ";
            if (sel === "checkin" || sel === "checkout") classes += "bg-navy text-white font-semibold";
            else if (sel === "inrange") classes += "bg-navy/10 text-navy";
            else if (status === "booked") classes += "bg-red-100 text-red-500";
            else if (status === "blocked") classes += "bg-gray-200 text-gray-400";
            else classes += "bg-[#E7F0E9] text-navy hover:bg-navy/10";

            return (
              <div key={i} className={classes} onClick={() => handleDayClick(day)}>
                {day}
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#E7F0E9]" /> Available</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100" /> Booked</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200" /> Blocked</div>
        </div>
      </div>

      {/* Selected Stay */}
      <div className="card mx-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-semibold text-navy">
            <Calendar size={18} /> Selected Stay
          </div>
          {(selecting.checkIn || selecting.checkOut) && (
            <button onClick={handleClear} className="text-gold text-sm font-semibold">Clear</button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Check-in</p>
            <p className="font-semibold text-navy">
              {selecting.checkIn ? selecting.checkIn.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
            </p>
            {selecting.checkIn && <p className="text-xs text-gray-400">{dayName(selecting.checkIn)}</p>}
          </div>
          <ArrowRight size={16} className="text-gray-300" />
          <div className="text-right">
            <p className="text-xs text-gray-500">Check-out</p>
            <p className="font-semibold text-navy">
              {selecting.checkOut ? selecting.checkOut.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
            </p>
            {selecting.checkOut && <p className="text-xs text-gray-400">{dayName(selecting.checkOut)}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Nights</p>
            <p className="font-bold text-navy">{nights || "—"}</p>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      {pricing && (
        <div className="card mx-4 mt-4">
          <div className="flex items-center gap-2 font-semibold text-navy mb-3">
            <Briefcase size={18} /> Price Summary
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Villa Charges ({formatCurrency(villa.pricePerNight)} x {nights} Nights)</span>
            <span className="font-semibold">{formatCurrency(pricing.villaCharges)}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-600">Taxes & Fees ({villa.taxPercent}%)</span>
            <span className="font-semibold">{formatCurrency(pricing.taxAmount)}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <span className="font-bold text-navy">Total Amount</span>
            <span className="font-bold text-navy text-lg">{formatCurrency(pricing.total)}</span>
          </div>
          <div className="bg-[#E7F0E9] rounded-xl p-3 mt-3 flex gap-2 text-xs text-teal">
            <Shield size={16} className="flex-shrink-0" />
            <span>Advance payment of {villa.advancePercent}% is required to confirm the booking.</span>
          </div>
        </div>
      )}

      <div className="px-4 mt-6">
        <button onClick={handleContinue} disabled={creating || !nights} className="btn-primary w-full disabled:opacity-50">
          {creating ? "Creating booking..." : "Continue to Book"} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CheckAvailability;