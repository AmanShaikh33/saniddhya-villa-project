import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },

    villa: { type: mongoose.Schema.Types.ObjectId, ref: "Villa", required: true },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },
    guests: { type: Number, required: true },

    guestInfo: {
      fullName: String,
      mobile: String,
      email: String,
      city: String,
      state: String,
      govtIdUrl: String,
      govtIdPublicId: String,
      govtIdType: { type: String, enum: ["Aadhaar Card", "PAN Card", "Passport"] },
      specialRequests: String,
      emergencyContact: {
        name: String,
        relationship: String,
        phone: String,
      },
    },

    pricing: {
      pricePerNight: Number,
      villaCharges: Number,
      taxAmount: Number,
      securityDeposit: Number,
      totalAmount: Number,
      advancePercent: Number,
      advanceAmount: Number,
      remainingAmount: Number,
    },

    status: {
      type: String,
      enum: ["pending_payment", "confirmed", "completed", "cancelled"],
      default: "pending_payment",
    },

    timeline: {
      bookingConfirmedAt: Date,
      advancePaidAt: Date,
      checkInAt: Date,
      completedAt: Date,
      cancelledAt: Date,
    },
  },
  { timestamps: true }
);

// Fast lookup for "My Bookings" by mobile number
bookingSchema.index({ "guestInfo.mobile": 1 });

export default mongoose.model("Booking", bookingSchema);