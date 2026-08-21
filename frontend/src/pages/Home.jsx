import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Star, Home as HomeIcon, Droplet, Shield, UtensilsCrossed, Calendar, User, ArrowRight, ChevronDown } from "lucide-react";
import { getVilla } from "../services/villaService";
import { useBooking } from "../context/BookingContext";
import { formatDate } from "../utils/formatDate";
import GuestSelector from "../components/booking/GuestSelector";
import LoadingScreen from "../components/common/LoadingScreen";

const VILLA_ID = import.meta.env.VITE_VILLA_ID;

const whyLoveUs = [
  { icon: HomeIcon, title: "Entire Villa" },
  { icon: Droplet, title: "Lawn & Shade" },
  { icon: Shield, title: "Private & Secure" },
  { icon: UtensilsCrossed, title: "Kitchen Access" },
];

const Home = () => {
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();
  const [villa, setVilla] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  useEffect(() => {
    getVilla(VILLA_ID)
      .then((res) => setVilla(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckAvailability = () => {
    updateBooking({ villaId: VILLA_ID });
    navigate("/check-availability");
  };

  if (loading) return <div className="p-6 text-center text-navy/60">Loading villa...</div>;
  if (!villa) return <div className="p-6 text-center text-red-500">Could not load villa. Check your backend is running.</div>;

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <HomeIcon className="text-navy" size={22} />
          <div>
            <p className="font-serif font-bold text-lg leading-none text-navy">Saniddhya</p>
            <p className="text-[10px] tracking-widest text-navy/70 leading-tight">VILLAS</p>
            <p className="text-[9px] tracking-widest text-gold font-semibold">ESCAPE TO PEACE</p>
          </div>
        </div>
        <Menu className="text-navy" size={22} />
      </div>

      <div className="relative mx-2 rounded-3xl overflow-hidden h-[560px]">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
          alt={villa.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 text-white text-sm">
          <Star size={14} className="fill-gold text-gold" />
          <span className="font-semibold">{villa.rating} ({villa.reviewCount}+ Reviews)</span>
        </div>

        <div className="absolute bottom-40 left-0 right-0 px-5 text-white">
          <p className="text-gold text-xs font-semibold tracking-wide mb-2">Welcome to {villa.name}</p>
          <h1 className="font-serif text-4xl font-bold leading-tight mb-3">
            Escape.<br />Relax.<br />Reconnect.
          </h1>
          <p className="text-sm text-white/90">A peaceful private villa with lawn, shade and premium amenities.</p>
        </div>

        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl p-4">
          <div className="flex gap-4 mb-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Check-in</p>
              <div className="flex items-center gap-2 font-semibold text-navy text-sm">
                <Calendar size={16} />
                {booking.checkIn ? formatDate(booking.checkIn) : "Select date"}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Check-out</p>
              <div className="flex items-center gap-2 font-semibold text-navy text-sm">
                <Calendar size={16} />
                {booking.checkOut ? formatDate(booking.checkOut) : "Select date"}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowGuestSelector(true)}
            className="border-t border-gray-100 pt-3 mb-4 w-full text-left"
          >
            <p className="text-xs text-gray-500 mb-1">Guests</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-navy text-sm">
                <User size={16} />
                {booking.guests} Guests
              </div>
              <ChevronDown size={16} className="text-navy" />
            </div>
          </button>

          <button onClick={handleCheckAvailability} className="btn-primary w-full">
            Check Availability <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {showGuestSelector && (
        <GuestSelector
          guests={booking.guests}
          minGuests={villa.minGuests}
          maxGuests={villa.maxGuests}
          onChange={(count) => updateBooking({ guests: count })}
          onClose={() => setShowGuestSelector(false)}
        />
      )}

      <div className="px-5 mt-8">
        <h2 className="font-serif text-2xl font-bold mb-5">Why Guests Love Us</h2>
        <div className="grid grid-cols-4 gap-3">
          {whyLoveUs.map(({ icon: Icon, title }) => (
            <div key={title} className="text-center">
              <div className="bg-[#F2E9DC] rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
                <Icon size={22} className="text-navy" />
              </div>
              <p className="text-xs font-semibold text-navy leading-tight">{title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-bold">Villa Highlights</h2>
          <button onClick={() => navigate("/gallery")} className="text-gold text-sm font-semibold flex items-center gap-1">
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5">
          {villa.gallery?.length > 0 ? (
            villa.gallery.slice(0, 3).map((img) => (
              <div key={img.publicId} className="flex-shrink-0 w-32">
                <img src={img.url} alt={img.category} className="w-full h-28 object-cover rounded-xl mb-1" />
                <p className="text-xs font-semibold text-navy">{img.category}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-navy/50">No gallery images yet.</p>
          )}
        </div>

        <div className="card mt-4 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-[#E7F0E9] rounded-full p-2">
              <Droplet size={18} className="text-teal" />
            </div>
            <p className="text-xs text-navy leading-snug">
              Surrounded by nature, perfect for family getaways, weekends & celebrations.
            </p>
          </div>
          <button onClick={() => navigate("/villa/" + VILLA_ID)} className="btn-gold text-xs px-4 py-2.5 whitespace-nowrap">
            Explore Villa
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;