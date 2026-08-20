import { useState } from "react";
import { Minus, Plus, X, User } from "lucide-react";

const GuestSelector = ({ guests, minGuests = 2, maxGuests = 12, onChange, onClose }) => {
  const [count, setCount] = useState(guests);

  const decrease = () => setCount((c) => Math.max(minGuests, c - 1));
  const increase = () => setCount((c) => Math.min(maxGuests, c + 1));

  const handleDone = () => {
    onChange(count);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl font-bold text-navy">Select Guests</h3>
          <button onClick={onClose}><X size={20} className="text-navy" /></button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={20} className="text-navy" />
            <div>
              <p className="font-semibold text-navy">Guests</p>
              <p className="text-xs text-gray-400">{minGuests} – {maxGuests} guests allowed</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={decrease}
              disabled={count <= minGuests}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30"
            >
              <Minus size={16} className="text-navy" />
            </button>
            <span className="font-bold text-navy text-lg w-6 text-center">{count}</span>
            <button
              onClick={increase}
              disabled={count >= maxGuests}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30"
            >
              <Plus size={16} className="text-navy" />
            </button>
          </div>
        </div>

        <button onClick={handleDone} className="btn-primary w-full mt-8">
          Done
        </button>
      </div>
    </div>
  );
};

export default GuestSelector;