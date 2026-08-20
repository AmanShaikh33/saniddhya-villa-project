import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Shield, User, Phone, Mail, MapPin, FileText, Star, PhoneCall, Briefcase, Lock, ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useBooking } from "../context/BookingContext";
import { updateGuestDetails, uploadGovtId } from "../services/bookingService";
import { formatCurrency } from "../utils/formatCurrency";
import IdUploadBox from "../components/booking/IdUploadBox";

const GuestDetails = () => {
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    city: "",
    state: "",
    specialRequests: "",
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
  });
  const [govtIdFile, setGovtIdFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.fullName || !form.mobile || !form.email) {
      toast.error("Please fill in your name, mobile and email");
      return;
    }
    if (!booking.bookingId) {
      toast.error("Booking session expired. Please start over.");
      navigate("/");
      return;
    }

    setSubmitting(true);
    try {
      const res = await updateGuestDetails(booking.bookingId, form);
      updateBooking({ guestInfo: res.data.guestInfo });

      if (govtIdFile) {
        const formData = new FormData();
        formData.append("govtId", govtIdFile);
        formData.append("govtIdType", "Aadhaar Card");
        await uploadGovtId(booking.bookingId, formData);
      }

      navigate("/payment");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const pricing = booking.pricing;

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={() => navigate(-1)}><ChevronLeft className="text-navy" size={22} /></button>
        <h1 className="font-serif text-xl font-semibold">Guest Details</h1>
        <Shield size={18} className="text-navy" />
      </div>

      {/* Booking Summary */}
      {booking.checkIn && (
        <div className="card mx-4">
          <p className="font-serif font-bold text-navy mb-1">Saniddhya Villas</p>
          <p className="text-xs text-gray-500 mb-2">Lonavala, Maharashtra</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>{new Date(booking.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} – {new Date(booking.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span>{booking.nights} Nights</span>
            <span>{booking.guests} Guests</span>
          </div>
        </div>
      )}

      {/* Guest Information */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 font-serif font-semibold text-navy mb-3">
          <User size={18} /> Guest Information
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="card p-3">
            <label className="flex items-center gap-1 text-xs text-gray-500 mb-1"><User size={12} /> Full Name</label>
            <input value={form.fullName} onChange={handleChange("fullName")} placeholder="Enter your full name" className="w-full text-sm font-medium outline-none bg-transparent" />
          </div>
          <div className="card p-3">
            <label className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Phone size={12} /> Mobile Number</label>
            <input value={form.mobile} onChange={handleChange("mobile")} placeholder="Enter mobile num" className="w-full text-sm font-medium outline-none bg-transparent" />
          </div>
          <div className="card p-3">
            <label className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Mail size={12} /> Email Address</label>
            <input value={form.email} onChange={handleChange("email")} placeholder="Enter email addre" className="w-full text-sm font-medium outline-none bg-transparent" />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 font-serif font-semibold text-navy mb-3">
          <MapPin size={18} /> Address
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="card p-3">
            <label className="text-xs text-gray-500 mb-1 block">City</label>
            <input value={form.city} onChange={handleChange("city")} placeholder="Enter city" className="w-full text-sm font-medium outline-none bg-transparent" />
          </div>
          <div className="card p-3">
            <label className="text-xs text-gray-500 mb-1 block">State</label>
            <input value={form.state} onChange={handleChange("state")} placeholder="Enter state" className="w-full text-sm font-medium outline-none bg-transparent" />
          </div>
        </div>
      </div>

      {/* Government ID */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 font-serif font-semibold text-navy mb-1">
          <FileText size={18} /> Government ID
        </div>
        <p className="text-xs text-gray-500 mb-3">Upload any one government issued ID proof</p>
        <IdUploadBox onFileSelect={setGovtIdFile} fileName={govtIdFile?.name} />
      </div>

      {/* Special Requests */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 font-serif font-semibold text-navy mb-3">
          <Star size={18} /> Special Requests <span className="text-xs text-gray-400 font-normal">(Optional)</span>
        </div>
        <div className="card">
          <textarea
            value={form.specialRequests}
            onChange={handleChange("specialRequests")}
            maxLength={200}
            placeholder="Any special requests for your stay? (e.g. early check-in, decoration, food package, BBQ setup)"
            className="w-full text-sm outline-none bg-transparent resize-none h-20"
          />
          <p className="text-right text-xs text-gray-400">{form.specialRequests.length}/200</p>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 font-serif font-semibold text-navy mb-3">
          <PhoneCall size={18} /> Emergency Contact
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="card p-3">
            <label className="text-xs text-gray-500 mb-1 block">Contact Name</label>
            <input value={form.emergencyName} onChange={handleChange("emergencyName")} placeholder="Enter name" className="w-full text-sm font-medium outline-none bg-transparent" />
          </div>
          <div className="card p-3">
            <label className="text-xs text-gray-500 mb-1 block">Relationship</label>
            <input value={form.emergencyRelationship} onChange={handleChange("emergencyRelationship")} placeholder="e.g. Friend, Relativ" className="w-full text-sm font-medium outline-none bg-transparent" />
          </div>
          <div className="card p-3">
            <label className="text-xs text-gray-500 mb-1 block">Phone Number</label>
            <input value={form.emergencyPhone} onChange={handleChange("emergencyPhone")} placeholder="Enter phone num" className="w-full text-sm font-medium outline-none bg-transparent" />
          </div>
        </div>
      </div>

      {/* Price Summary */}
      {pricing && (
        <div className="card mx-4 mt-6">
          <div className="flex items-center gap-2 font-serif font-semibold text-navy mb-3">
            <Briefcase size={18} /> Price Summary
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Villa Charges ({formatCurrency(pricing.pricePerNight)} x {booking.nights} Nights)</span>
            <span className="font-semibold">{formatCurrency(pricing.villaCharges)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Taxes & Fees</span>
            <span className="font-semibold">{formatCurrency(pricing.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-600">Security Deposit (Refundable)</span>
            <span className="font-semibold">{formatCurrency(pricing.securityDeposit)}</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between text-teal">
            <span className="font-semibold">Advance Payment ({pricing.advancePercent}%)</span>
            <span className="font-semibold">- {formatCurrency(pricing.advanceAmount)}</span>
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
            <div>
              <p className="font-bold text-navy">Total Amount</p>
              <p className="text-xs text-gray-400">(Pay advance to confirm your booking)</p>
            </div>
            <span className="font-bold text-navy text-lg">{formatCurrency(pricing.advanceAmount)}</span>
          </div>
        </div>
      )}

      <div className="px-4 mt-6">
        <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          <Lock size={16} /> {submitting ? "Saving..." : "Proceed to Payment"} <ArrowRight size={18} />
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">🛡 Your information is safe and secure with us.</p>
      </div>
    </div>
  );
};

export default GuestDetails;