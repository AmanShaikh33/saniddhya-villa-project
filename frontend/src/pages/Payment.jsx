import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Calendar, Briefcase, Lock, Shield, ChevronRight, Clock, Wallet, CreditCard, Landmark, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useBooking } from "../context/BookingContext";
import { createPaymentOrder, verifyPayment } from "../services/paymentService";
import { formatCurrency } from "../utils/formatCurrency";

const paymentMethods = [
  { id: "upi", label: "UPI", desc: "Pay using any UPI app", icon: Zap },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, MasterCard, Rupay & more", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", desc: "All major banks supported", icon: Landmark },
  { id: "wallet", label: "Wallets", desc: "Pay using popular wallets", icon: Wallet },
];

const Payment = () => {
  const navigate = useNavigate();
  const { booking, updateBooking, resetBooking } = useBooking();
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [paying, setPaying] = useState(false);

  const pricing = booking.pricing;

  const handlePay = async () => {
    if (!booking.bookingId) {
      toast.error("Booking session expired. Please start over.");
      navigate("/");
      return;
    }
    if (!window.Razorpay) {
      toast.error("Payment gateway failed to load. Check your internet connection.");
      return;
    }

    setPaying(true);
    try {
      const order = await createPaymentOrder(booking.bookingId, "advance");

      const rzp = new window.Razorpay({
        key: order.data.keyId,
        amount: order.data.amount,
        currency: order.data.currency,
        name: "Saniddhya Villas",
        description: `Advance payment for ${order.data.booking.bookingId}`,
        order_id: order.data.orderId,
        prefill: {
          name: booking.guestInfo?.fullName,
          email: booking.guestInfo?.email,
          contact: booking.guestInfo?.mobile,
        },
        theme: { color: "#1B3A4B" },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! Booking confirmed.");
            resetBooking();
            navigate("/bookings");
          } catch (err) {
            toast.error("Payment verification failed: " + err.message);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });

      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setPaying(false);
      });

      rzp.open();
    } catch (err) {
      toast.error(err.message);
      setPaying(false);
    }
  };

  if (!pricing) {
    return (
      <div className="p-6 text-center text-navy/60">
        No active booking found. <button onClick={() => navigate("/")} className="text-gold underline">Go home</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={() => navigate(-1)}><ChevronLeft className="text-navy" size={22} /></button>
        <h1 className="font-serif text-xl font-semibold">Payment</h1>
        <div className="flex items-center gap-1 text-xs text-navy"><ShieldCheck size={16} /> Secure Booking</div>
      </div>

      {/* Booking Summary */}
      <div className="px-4">
        <div className="flex items-center gap-2 font-serif font-semibold text-navy mb-3">
          <Calendar size={18} /> Booking Summary
        </div>
        <div className="card flex gap-3 items-center mb-4">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&q=80"
            alt="Saniddhya Villas"
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <p className="font-serif font-bold text-navy">Saniddhya Villas</p>
            <p className="text-xs text-gray-500 mb-1">Lonavala, Maharashtra</p>
            <div className="flex gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Calendar size={12} />
                {new Date(booking.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} – {new Date(booking.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span>{booking.nights} Nights</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{booking.guests} Guests</p>
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="card mx-4">
        <div className="flex items-center gap-2 font-serif font-semibold text-navy mb-3">
          <Briefcase size={18} /> Payment Breakdown
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Villa Charges ({formatCurrency(pricing.pricePerNight)} x {booking.nights} Nights)</span>
          <span className="font-semibold">{formatCurrency(pricing.villaCharges)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Taxes & Fees ({pricing.advancePercent ? "" : ""}{pricing.taxAmount ? "" : ""}12%)</span>
          <span className="font-semibold">{formatCurrency(pricing.taxAmount)}</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-600">Security Deposit (Refundable)</span>
          <span className="font-semibold">{formatCurrency(pricing.securityDeposit)}</span>
        </div>
        <div className="flex justify-between text-sm text-teal mb-3">
          <span className="font-semibold">Advance Payment ({pricing.advancePercent}%)</span>
          <span className="font-semibold">- {formatCurrency(pricing.advanceAmount)}</span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between">
          <span className="font-bold text-navy">Total Payable Today</span>
          <span className="font-bold text-navy text-lg">{formatCurrency(pricing.advanceAmount)}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-4 mt-6">
        <h2 className="font-serif font-semibold text-navy mb-3">Choose Payment Method</h2>
        <div className="space-y-3">
          {paymentMethods.map(({ id, label, desc, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedMethod(id)}
              className={`w-full card flex items-center gap-3 text-left ${selectedMethod === id ? "ring-2 ring-navy" : ""}`}
            >
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selectedMethod === id ? "bg-navy border-navy" : "border-gray-300"}`} />
              <Icon size={18} className="text-navy flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-navy text-sm">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="card mx-4 mt-6">
        <div className="flex items-center gap-2 font-serif font-semibold text-navy mb-3">
          <Shield size={18} /> Cancellation & Villa Policy
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-2"><Calendar size={14} /> 50% advance required to book</div>
          <div className="flex items-center gap-2"><Clock size={14} /> Check-in 01:00 PM</div>
          <div className="flex items-center gap-2"><Wallet size={14} /> Advance amount is non-refundable</div>
          <div className="flex items-center gap-2"><Clock size={14} /> Check-out 11:00 AM</div>
        </div>
      </div>

      <div className="px-4 mt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-navy">{formatCurrency(pricing.advanceAmount)}</p>
            <p className="text-xs text-gray-400">Total Payable Today</p>
          </div>
        </div>
        <button onClick={handlePay} disabled={paying} className="btn-gold w-full disabled:opacity-50">
          <Lock size={16} /> {paying ? "Processing..." : "Pay Securely"}
        </button>
      </div>
    </div>
  );
};

export default Payment;