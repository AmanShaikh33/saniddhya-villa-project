import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Heart, Share2, Users, BedDouble, Bath, Maximize,
  Droplet, Waves, Bell, Wifi, CheckCircle, Car, Radio, Flame,
  Star, Image as ImageIcon, MapPin, Shield, ArrowRight,
} from "lucide-react";
import { getVilla } from "../services/villaService";
import { useBooking } from "../context/BookingContext";

const VILLA_ID = import.meta.env.VITE_VILLA_ID;

const iconMap = {
  droplet: Droplet,
  waves: Waves,
  bell: Bell,
  wifi: Wifi,
  "check-circle": CheckCircle,
  car: Car,
  target: Radio,
  flame: Flame,
};

const VillaDetails = () => {
  const navigate = useNavigate();
  const { updateBooking } = useBooking();
  const [villa, setVilla] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    getVilla(VILLA_ID).then((res) => setVilla(res.data));
  }, []);

  if (!villa) return <div className="p-6 text-center text-navy/60">Loading...</div>;

  const heroImage = villa.gallery?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80";
  const thumbs = villa.gallery?.length
    ? villa.gallery.slice(0, 4)
    : [
        { category: "Exterior", url: heroImage, publicId: "1" },
        { category: "Living Room", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200&q=80", publicId: "2" },
        { category: "Bedroom", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&q=80", publicId: "3" },
        { category: "Pool", url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=200&q=80", publicId: "4" },
      ];

  const handleCheckAvailability = () => {
    updateBooking({ villaId: VILLA_ID });
    navigate("/check-availability");
  };

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={() => navigate(-1)}><ChevronLeft className="text-navy" size={22} /></button>
        <h1 className="font-serif text-xl font-semibold">Villa Details</h1>
        <div className="flex gap-3">
          <Heart className="text-navy" size={20} />
          <Share2 className="text-navy" size={20} />
        </div>
      </div>

      {/* Hero image */}
      <div className="relative mx-4 rounded-2xl overflow-hidden h-64">
        <img src={heroImage} alt={villa.name} className="w-full h-full object-cover" />
        <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">1 / {villa.gallery?.length || 20}</span>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 px-4 mt-3 overflow-x-auto">
        {thumbs.map((img, i) => (
          <div key={img.publicId || i} className="relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden">
            <img src={img.url} alt={img.category} className="w-full h-full object-cover" />
            <span className="absolute bottom-1 left-1 text-[9px] text-white font-semibold bg-black/40 px-1 rounded">{img.category}</span>
          </div>
        ))}
        <button
          onClick={() => navigate("/gallery")}
          className="flex-shrink-0 w-20 h-16 rounded-xl bg-navy text-white flex items-center justify-center text-xs font-semibold"
        >
          +{Math.max((villa.gallery?.length || 20) - 4, 16)}
        </button>
      </div>

      {/* Title */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-navy">{villa.name}</h2>
          <span className="bg-[#E7F0E9] text-teal text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Star size={12} className="fill-teal" /> {villa.rating} ({villa.reviewCount}+ Reviews)
          </span>
        </div>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={14} /> {villa.city}, {villa.state}</p>
        <p className="text-sm text-gray-600 mt-3">{villa.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 px-4 mt-6 text-center">
        <div>
          <Users size={20} className="text-navy mx-auto mb-1" />
          <p className="font-bold text-navy text-sm">{villa.minGuests} – {villa.maxGuests}</p>
          <p className="text-xs text-gray-400">Guests</p>
        </div>
        <div>
          <BedDouble size={20} className="text-navy mx-auto mb-1" />
          <p className="font-bold text-navy text-sm">{villa.bedrooms}</p>
          <p className="text-xs text-gray-400">Bedrooms</p>
        </div>
        <div>
          <Bath size={20} className="text-navy mx-auto mb-1" />
          <p className="font-bold text-navy text-sm">{villa.bathrooms}</p>
          <p className="text-xs text-gray-400">Bathrooms</p>
        </div>
        <div>
          <Maximize size={20} className="text-navy mx-auto mb-1" />
          <p className="font-bold text-navy text-sm">{villa.sizeSqft}</p>
          <p className="text-xs text-gray-400">sq.ft</p>
        </div>
      </div>

      {/* Amenities */}
      <div className="px-4 mt-8">
        <h3 className="font-serif text-xl font-bold mb-4">Amenities</h3>
        <div className="grid grid-cols-4 gap-4">
          {villa.amenities?.slice(0, 8).map((a) => {
            const Icon = iconMap[a.icon] || CheckCircle;
            return (
              <div key={a._id} className="text-center">
                <div className="bg-[#F2E9DC] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-1">
                  <Icon size={18} className="text-navy" />
                </div>
                <p className="text-[10px] text-navy font-medium leading-tight">{a.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gallery / Location / Rules buttons */}
      <div className="grid grid-cols-3 gap-2 px-4 mt-6">
        <button onClick={() => navigate("/gallery")} className="card flex flex-col items-center gap-1 py-3">
          <ImageIcon size={18} className="text-navy" />
          <span className="text-xs font-semibold text-navy">Gallery</span>
        </button>
        <button onClick={() => navigate("/location")} className="card flex flex-col items-center gap-1 py-3">
          <MapPin size={18} className="text-navy" />
          <span className="text-xs font-semibold text-navy">Location</span>
        </button>
        <button onClick={() => navigate("/rules")} className="card flex flex-col items-center gap-1 py-3">
          <Shield size={18} className="text-navy" />
          <span className="text-xs font-semibold text-navy">Rules</span>
        </button>
      </div>

      {/* About */}
      <div className="px-4 mt-6">
        <h3 className="font-serif text-xl font-bold mb-3">About This Villa</h3>
        <p className={`text-sm text-gray-600 ${!showFullDesc && "line-clamp-4"}`}>{villa.description}</p>
        <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-gold text-sm font-semibold mt-2 flex items-center gap-1">
          {showFullDesc ? "Show Less" : "Read More"}
        </button>
      </div>

      <div className="px-4 mt-6 pb-4">
        <button onClick={handleCheckAvailability} className="btn-primary w-full">
          Check Availability <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default VillaDetails;