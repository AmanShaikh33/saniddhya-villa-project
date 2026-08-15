import "dotenv/config";

import connectDB from "./src/config/db.js";
import Villa from "./src/models/Villa.model.js";

const villaData = {
  name: "Saniddhya Villas",
  tagline: "Escape to Peace",
  description:
    "Saniddhya Villas offers a peaceful escape with lush green lawn, private pool, spacious interiors and all modern amenities. Whether it's a family vacation, weekend getaway or celebration, our villa is the perfect choice.",
  address: "Krishna Villa, Lonavala, Maharashtra 410401",
  city: "Lonavala",
  state: "Maharashtra",
  pincode: "410401",

  location: {
    lat: 18.7537,
    lng: 73.4062,
  },

  pricePerNight: 9000,
  taxPercent: 12,
  securityDeposit: 2000,
  advancePercent: 50,

  minGuests: 2,
  maxGuests: 12,
  bedrooms: 4,
  bathrooms: 4,
  sizeSqft: 6000,

  amenities: [
    { name: "Lawn & Shade", icon: "droplet" },
    { name: "Private Pool", icon: "waves" },
    { name: "Kitchen Access", icon: "bell" },
    { name: "Wi-Fi", icon: "wifi" },
    { name: "Power Backup", icon: "check-circle" },
    { name: "Parking Space", icon: "car" },
    { name: "Music System", icon: "target" },
    { name: "BBQ (On Request)", icon: "flame" },
  ],

  coverImage: {
    url: "",
    publicId: "",
  },
  gallery: [],

  checkInTime: "1:00 PM",
  checkOutTime: "11:00 AM",

  rules: [
    {
      title: "Check-in & Check-out",
      points: ["Check-in: 1:00 PM onwards", "Check-out: 11:00 AM", "Early check-in / late check-out is subject to availability."],
    },
    {
      title: "Music Policy",
      points: ["Music is allowed till 10:00 PM only in outdoor areas.", "Please maintain peace and respect the neighbors."],
    },
    {
      title: "Swimming Pool",
      points: ["Use pool at your own risk. No diving, running or jumping.", "Children must be supervised by adults."],
    },
    {
      title: "Kitchen Usage",
      points: ["Kitchen can be used for light cooking only.", "Please keep the kitchen clean after use."],
    },
    {
      title: "BBQ",
      points: ["BBQ allowed at the designated area only.", "Please inform us in advance (Charges applicable)."],
    },
    {
      title: "Pets",
      points: ["Pets are not allowed in the villa premises."],
    },
    {
      title: "Visitors",
      points: ["Outside visitors are not allowed after 10:00 PM.", "Please carry valid ID proof for all guests."],
    },
    {
      title: "Food & Beverages",
      points: ["Food is available on order (Charges applicable).", "Outside food is allowed. Alcohol allowed in moderation."],
    },
    {
      title: "Safety & Property",
      points: [
        "Please take care of your belongings. Any damage to property will be charged as per actuals.",
        "We are not responsible for any loss or injury.",
      ],
    },
  ],

  cancellationPolicy: [
    { label: "More than 15 days before check-in", refundPercent: 100 },
    { label: "7 - 15 days before check-in", refundPercent: 50 },
    { label: "Less than 7 days before check-in", refundPercent: 0 },
  ],

  nearbyAttractions: [
    { name: "Bhushi Dam", travelTimeMins: 10, imageUrl: "" },
    { name: "Tiger Point", travelTimeMins: 20, imageUrl: "" },
    { name: "Lonavala Station", travelTimeMins: 12, imageUrl: "" },
    { name: "Mumbai-Pune Expwy", travelTimeMins: 8, imageUrl: "" },
  ],

  distances: [
    { label: "Pune", km: 65, timeText: "1 hr 25 min" },
    { label: "Mumbai", km: 90, timeText: "2 hr 10 min" },
    { label: "Station", km: 4, timeText: "10 min" },
    { label: "Airport", km: 70, timeText: "1 hr 40 min" },
  ],

  propertyManager: {
    name: "Rohit Patil",
    phone: "+91 90112 26662",
  },

  rating: 4.8,
  reviewCount: 120,

  isActive: true,
};

const seedVilla = async () => {
  try {
    await connectDB();

    const existing = await Villa.findOne({ name: "Saniddhya Villas" });
    if (existing) {
      console.log("Villa already exists. ID:", existing._id.toString());
      process.exit(0);
    }

    const villa = await Villa.create(villaData);
    console.log("Villa created successfully!");
    console.log("Villa ID:", villa._id.toString());
    console.log("Use this ID in Postman for all /api/villas/:id routes");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedVilla();