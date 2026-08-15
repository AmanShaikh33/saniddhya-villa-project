import Booking from "../models/Booking.model.js";
import Villa from "../models/Villa.model.js";
import Availability from "../models/Availability.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import calculatePrice from "../utils/calculatePrice.js";
import generateBookingId from "../utils/generateBookingId.js";

// @route POST /api/bookings
// Called from "Continue to Book" on Check Availability screen. No login needed.
export const createBooking = async (req, res, next) => {
  try {
    const { villaId, checkIn, checkOut, guests } = req.body;

    if (!villaId || !checkIn || !checkOut || !guests) {
      throw new ApiError(400, "villaId, checkIn, checkOut and guests are required");
    }

    const villa = await Villa.findById(villaId);
    if (!villa) throw new ApiError(404, "Villa not found");

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
    if (nights < 1) throw new ApiError(400, "Check-out must be after check-in");

    if (guests < villa.minGuests || guests > villa.maxGuests) {
      throw new ApiError(400, `Guests must be between ${villa.minGuests} and ${villa.maxGuests}`);
    }

    const conflict = await Availability.findOne({
      villa: villaId,
      date: { $gte: start, $lt: end },
      status: { $in: ["booked", "blocked"] },
    });
    if (conflict) throw new ApiError(409, "Selected dates are no longer available");

    const pricing = calculatePrice({
      pricePerNight: villa.pricePerNight,
      nights,
      taxPercent: villa.taxPercent,
      securityDeposit: villa.securityDeposit,
      advancePercent: villa.advancePercent,
    });

    const booking = await Booking.create({
      bookingId: generateBookingId(),
      villa: villaId,
      checkIn: start,
      checkOut: end,
      nights,
      guests,
      pricing,
      status: "pending_payment",
    });

    // frontend should save booking._id (e.g. localStorage) to reference it in later steps
    res.status(201).json(new ApiResponse(201, booking, "Draft booking created"));
  } catch (error) {
    next(error);
  }
};

// @route PATCH /api/bookings/:id/guest-details
export const updateGuestDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new ApiError(404, "Booking not found");

    const { fullName, mobile, email, city, state, specialRequests, emergencyName, emergencyRelationship, emergencyPhone } = req.body;

    if (!mobile) throw new ApiError(400, "Mobile number is required");

    booking.guestInfo = {
      ...booking.guestInfo,
      fullName,
      mobile,
      email,
      city,
      state,
      specialRequests,
      emergencyContact: {
        name: emergencyName,
        relationship: emergencyRelationship,
        phone: emergencyPhone,
      },
    };

    await booking.save();
    res.status(200).json(new ApiResponse(200, booking, "Guest details saved"));
  } catch (error) {
    next(error);
  }
};

// @route POST /api/bookings/:id/guest-id  (multipart/form-data, field name: "govtId")
export const uploadGovtId = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new ApiError(404, "Booking not found");
    if (!req.file) throw new ApiError(400, "ID proof file is required");

    booking.guestInfo.govtIdUrl = req.file.path;
    booking.guestInfo.govtIdPublicId = req.file.filename;
    booking.guestInfo.govtIdType = req.body.govtIdType || "Aadhaar Card";

    await booking.save();
    res.status(200).json(new ApiResponse(200, booking, "ID uploaded successfully"));
  } catch (error) {
    next(error);
  }
};

// @route GET /api/bookings/lookup?mobile=9999999999&status=upcoming|past
// Powers "My Bookings" screen — guest enters their mobile number to find bookings
export const getMyBookings = async (req, res, next) => {
  try {
    const { mobile, status } = req.query;
    if (!mobile) throw new ApiError(400, "Mobile number is required");

    const filter = { "guestInfo.mobile": mobile };
    if (status === "upcoming") {
      filter.status = { $in: ["confirmed", "pending_payment"] };
      filter.checkOut = { $gte: new Date() };
    } else if (status === "past") {
      filter.$or = [{ status: "completed" }, { status: "cancelled" }, { checkOut: { $lt: new Date() } }];
    }

    const bookings = await Booking.find(filter)
      .populate("villa", "name city state coverImage")
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, bookings));
  } catch (error) {
    next(error);
  }
};

// @route GET /api/bookings/:id
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "villa",
      "name city state coverImage propertyManager checkInTime checkOutTime"
    );
    if (!booking) throw new ApiError(404, "Booking not found");
    res.status(200).json(new ApiResponse(200, booking));
  } catch (error) {
    next(error);
  }
};

// @route PATCH /api/bookings/:id/cancel
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new ApiError(404, "Booking not found");
    if (booking.status === "completed") throw new ApiError(400, "Completed bookings cannot be cancelled");

    booking.status = "cancelled";
    booking.timeline.cancelledAt = new Date();
    await booking.save();

    await Availability.updateMany(
      { villa: booking.villa, date: { $gte: booking.checkIn, $lt: booking.checkOut } },
      { $set: { status: "available" }, $unset: { booking: "" } }
    );

    res.status(200).json(new ApiResponse(200, booking, "Booking cancelled"));
  } catch (error) {
    next(error);
  }
};