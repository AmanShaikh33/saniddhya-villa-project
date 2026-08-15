import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },

    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["UPI", "Card", "NetBanking", "Wallet", "Razorpay"],
      default: "Razorpay",
    },
    purpose: { type: String, enum: ["advance", "remaining"], default: "advance" },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);