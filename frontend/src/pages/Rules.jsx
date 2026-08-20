import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, Shield, XCircle, Headphones, Phone, MessageCircle, Download } from "lucide-react";
import { getVilla } from "../services/villaService";

const VILLA_ID = import.meta.env.VITE_VILLA_ID;

const Rules = () => {
  const navigate = useNavigate();
  const [villa, setVilla] = useState(null);

  useEffect(() => {
    getVilla(VILLA_ID).then((res) => setVilla(res.data));
  }, []);

  if (!villa) return <div className="p-6 text-center text-navy/60">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={() => navigate(-1)}><ChevronLeft className="text-navy" size={22} /></button>
        <h1 className="font-serif text-xl font-semibold">Rules & Regulations</h1>
        <FileText className="text-navy" size={20} />
      </div>
      <p className="text-center text-sm text-gray-500 mb-4">{villa.name}, {villa.city}</p>

      <div className="bg-[#F2E9DC] mx-4 rounded-xl p-4 flex gap-3 items-start mb-4">
        <Shield size={20} className="text-navy flex-shrink-0 mt-0.5" />
        <p className="text-sm text-navy">To ensure a comfortable and safe stay for all our guests, please read and follow the villa rules carefully.</p>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3">
        {villa.rules?.map((rule, i) => (
          <div key={rule._id} className="card">
            <p className="font-bold text-navy text-sm mb-2">{i + 1}. {rule.title}</p>
            {rule.points.map((point, j) => (
              <p key={j} className="text-xs text-gray-600 mb-1">{point}</p>
            ))}
          </div>
        ))}
      </div>

      <div className="bg-[#E7F0E9] mx-4 rounded-xl p-4 mt-4">
        <div className="flex items-center gap-2 font-bold text-teal mb-2">
          <XCircle size={18} /> Cancellation Policy
        </div>
        {villa.cancellationPolicy?.map((p) => (
          <p key={p._id} className="text-xs text-teal mb-1">
            • <strong>{p.label}</strong>: {p.refundPercent}% refund
          </p>
        ))}
      </div>

      <div className="bg-[#F2E9DC] mx-4 rounded-xl p-3 mt-4 text-xs text-navy">
        ⭐ By booking with {villa.name}, you agree to abide by the above rules and regulations.
      </div>

      <div className="px-4 mt-6 flex items-center gap-3">
        <Headphones className="text-navy flex-shrink-0" size={24} />
        <div className="flex-1">
          <p className="font-bold text-navy text-sm">Need Help?</p>
          <p className="text-xs text-gray-500">We're here to make your stay comfortable.</p>
        </div>
        <div className="text-right">
          <a href={`tel:${villa.propertyManager?.phone}`} className="flex items-center gap-1 text-xs text-navy font-semibold justify-end">
            <Phone size={12} /> {villa.propertyManager?.phone}
          </a>
          <a href={`https://wa.me/${villa.propertyManager?.phone?.replace(/\D/g, "")}`} className="flex items-center gap-1 text-xs text-teal font-semibold justify-end mt-1">
            <MessageCircle size={12} /> WhatsApp Us
          </a>
        </div>
      </div>

      <div className="px-4 mt-6 pb-4">
        <button className="btn-primary w-full">
          <Download size={16} /> Download Full Rules (PDF)
        </button>
      </div>
    </div>
  );
};

export default Rules;