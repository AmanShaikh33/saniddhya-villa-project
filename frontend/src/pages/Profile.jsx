import { User, Phone, Mail, MapPin, HelpCircle, Shield, LogOut, ChevronRight, Home as HomeIcon } from "lucide-react";
import { useBooking } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { booking, resetBooking } = useBooking();
  const guestInfo = booking.guestInfo;

  const menuItems = [
    { icon: Shield, label: "Rules & Policies", action: () => navigate("/rules") },
    { icon: MapPin, label: "Villa Location", action: () => navigate("/location") },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
  ];

  return (
    <div>
      <div className="px-4 py-4">
        <h1 className="font-serif text-2xl font-bold">Profile</h1>
      </div>

      <div className="card mx-4 flex items-center gap-4">
        <div className="bg-[#F2E9DC] rounded-full w-16 h-16 flex items-center justify-center">
          <User size={28} className="text-navy" />
        </div>
        <div>
          <p className="font-serif font-bold text-navy text-lg">{guestInfo?.fullName || "Guest"}</p>
          {guestInfo?.mobile && (
            <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12} /> {guestInfo.mobile}</p>
          )}
          {guestInfo?.email && (
            <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12} /> {guestInfo.email}</p>
          )}
        </div>
      </div>

      {!guestInfo && (
        <div className="card mx-4 mt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">Your details will appear here after your first booking.</p>
          <button onClick={() => navigate("/")} className="btn-primary w-full">
            <HomeIcon size={16} /> Start a Booking
          </button>
        </div>
      )}

      <div className="px-4 mt-6 space-y-2">
        {menuItems.map(({ icon: Icon, label, action }) => (
          <button key={label} onClick={action} className="card w-full flex items-center justify-between">
            <span className="flex items-center gap-3 text-sm font-semibold text-navy">
              <Icon size={18} /> {label}
            </span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      {guestInfo && (
        <div className="px-4 mt-6">
          <button
            onClick={() => {
              resetBooking();
              navigate("/");
            }}
            className="card w-full flex items-center justify-center gap-2 text-red-500 font-semibold text-sm"
          >
            <LogOut size={16} /> Clear My Session
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;