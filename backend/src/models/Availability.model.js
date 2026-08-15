import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    villa: { type: mongoose.Schema.Types.ObjectId, ref: "Villa", required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "blocked"],
      default: "available",
    },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    note: { type: String },
  },
  { timestamps: true }
);

availabilitySchema.index({ villa: 1, date: 1 }, { unique: true });

export default mongoose.model("Availability", availabilitySchema);