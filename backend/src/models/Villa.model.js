import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    category: {
      type: String,
      enum: ["Exterior", "Living Room", "Bedrooms", "Kitchen", "Pool", "Lawn", "Night View", "Sit-Out / Balcony"],
      required: true,
    },
    caption: { type: String },
  },
  { _id: false }
);

const villaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: "Saniddhya Villas" },
    tagline: { type: String, default: "Escape to Peace" },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, default: "Lonavala" },
    state: { type: String, required: true, default: "Maharashtra" },
    pincode: { type: String },

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    pricePerNight: { type: Number, required: true, default: 9000 },
    taxPercent: { type: Number, required: true, default: 12 },
    securityDeposit: { type: Number, required: true, default: 2000 },
    advancePercent: { type: Number, required: true, default: 50 },

    minGuests: { type: Number, default: 2 },
    maxGuests: { type: Number, default: 12 },
    bedrooms: { type: Number, default: 4 },
    bathrooms: { type: Number, default: 4 },
    sizeSqft: { type: Number, default: 6000 },

    amenities: [
      {
        name: String,
        icon: String,
      },
    ],

    coverImage: {
      url: String,
      publicId: String,
    },
    gallery: [galleryImageSchema],

    checkInTime: { type: String, default: "1:00 PM" },
    checkOutTime: { type: String, default: "11:00 AM" },

    rules: [
      {
        title: String,
        points: [String],
      },
    ],
    cancellationPolicy: [
      {
        label: String,
        refundPercent: Number,
      },
    ],

    nearbyAttractions: [
      {
        name: String,
        travelTimeMins: Number,
        imageUrl: String,
      },
    ],
    distances: [
      {
        label: String,
        km: Number,
        timeText: String,
      },
    ],

    propertyManager: {
      name: String,
      phone: String,
    },

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Villa", villaSchema);