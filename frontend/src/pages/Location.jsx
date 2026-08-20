import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Share2, Navigation, Phone, MessageCircle, Home, Building, Train, Plane, ParkingCircle, Accessibility, Zap as EvIcon, Camera } from "lucide-react";
import { getVilla } from "../services/villaService";

const VILLA_ID = import.meta.env.VITE_VILLA_ID;

const iconMapDistance = { Pune: Home, Mumbai: Building, Station: Train, Airport: Plane };

const Location = () => {
  const navigate = useNavigate();
  const [villa, setVilla] = useState(null);

  useEffect(() => {
    getVilla(VILLA_ID).then((res) => setVilla(res.data));
  }, []);

  if (!villa) return <div className="p-6 text-center text-navy/60">Loading...</div>;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${villa.location.lat},${villa.location.lng}`;

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={() => navigate(-1)}><ChevronLeft className="text-navy" size={22} /></button>
        <h1 className="font-serif text-xl font-semibold">Location</h1>
        <Share2 className="text-navy" size={20} />
      </div>

      {/* Static map placeholder */}
      <div className="mx-4 rounded-2xl bg-[#E7F0E9] h-56 relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
            <div className="bg-white w-3 h-3 rounded-full" />
          </div>
          <p className="text-navy font-semibold text-sm bg-white px-3 py-1 rounded-full shadow">Saniddhya Villas</p>
        </div>
      </div>

      <div className="card mx-4 mt-4 flex gap-3 items-center">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80"
          alt={villa.name}
          className="w-16 h-16 rounded-xl object-cover"
        />
        <div className="flex-1">
          <p className="font-serif font-bold text-navy">{villa.name}</p>
          <p className="text-xs text-gray-500">{villa.address}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 mt-4">
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="btn-primary text-xs py-3 flex-col gap-1">
          <Navigation size={16} /> Directions
        </a>
        <a href={`tel:${villa.propertyManager?.phone}`} className="card flex flex-col items-center justify-center gap-1 text-xs font-semibold text-navy py-3">
          <Phone size={16} /> Call
        </a>
        <a href={`https://wa.me/${villa.propertyManager?.phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="card flex flex-col items-center justify-center gap-1 text-xs font-semibold text-teal py-3">
          <MessageCircle size={16} /> WhatsApp
        </a>
      </div>

      <div className="px-4 mt-6">
        <h3 className="font-serif text-lg font-bold mb-3">Nearby Attractions</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {villa.nearbyAttractions?.map((attr) => (
            <div key={attr._id} className="flex-shrink-0 w-28">
              <div className="bg-gray-200 h-20 rounded-xl mb-1" />
              <p className="text-xs font-semibold text-navy">{attr.name}</p>
              <p className="text-[10px] text-gray-400">🚗 {attr.travelTimeMins} min</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        <h3 className="font-serif text-lg font-bold mb-3">Distance from {villa.name}</h3>
        <div className="grid grid-cols-2 gap-3">
          {villa.distances?.map((d) => {
            const Icon = iconMapDistance[d.label] || Home;
            return (
              <div key={d._id} className="card">
                <Icon size={18} className="text-navy mb-2" />
                <p className="font-bold text-navy">{d.km} km</p>
                <p className="text-xs text-gray-500">{d.label} · {d.timeText}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 px-4 mt-6 overflow-x-auto">
        {[
          { icon: ParkingCircle, label: "Free Parking 10 Cars" },
          { icon: Accessibility, label: "Wheelchair Friendly" },
          { icon: EvIcon, label: "EV Charging Available" },
          { icon: Camera, label: "CCTV Security" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="bg-[#E7F0E9] rounded-xl px-3 py-2 flex items-center gap-2 flex-shrink-0">
            <Icon size={14} className="text-teal" />
            <span className="text-xs font-semibold text-teal whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>

      <div className="px-4 mt-6 pb-6">
        <div className="card">
          <p className="text-xs text-gray-400">Property Manager</p>
          <p className="font-bold text-navy">{villa.propertyManager?.name}</p>
          <p className="text-xs text-gray-500">{villa.propertyManager?.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default Location;