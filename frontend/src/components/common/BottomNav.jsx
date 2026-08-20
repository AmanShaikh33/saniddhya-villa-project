import { NavLink } from "react-router-dom";
import { Home, Compass, Calendar, MapPin, User } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/explore", icon: Compass, label: "Explore" },
  { to: "/bookings", icon: Calendar, label: "Bookings" },
  { to: "/location", icon: MapPin, label: "Location" },
  { to: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex justify-around py-3 z-50">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className="flex flex-col items-center gap-1 text-xs text-gray-400 [&.active]:text-navy"
        >
          {({ isActive }) => (
            <>
              <Icon size={22} className={isActive ? "text-navy" : "text-gray-400"} />
              <span className={isActive ? "text-navy font-semibold" : "text-gray-400"}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;