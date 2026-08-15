import crypto from "crypto";
import razorpayInstance from "../config/razorpay.js";
import Booking from "../models/Booking.model.js";
import Availability from "../models/Availability.model.js";
import Payment from "../models/Payment.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createOrder = async (req, res, next) => {
  try {
    if (!razorpayInstance) {
      throw new ApiError(500, "Razorpay is not configured on the server yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env");
    }

    const { bookingId, purpose = "advance" } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) throw new ApiError(404, "Booking not found");

    const amount = purpose === "advance" ? booking.pricing.advanceAmount : booking.pricing.remainingAmount;

    const order = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `${booking.bookingId}-${purpose}`,
      notes: { bookingId: booking._id.toString(), purpose },
    });

    await Payment.create({
      booking: booking._id,
      razorpayOrderId: order.id,
      amount,
      purpose,
      status: "created",
    });

    res.status(201).json(
      new ApiResponse(201, {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        booking: {
          id: booking._id,
          bookingId: booking.bookingId,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Payment.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: "failed" });
      throw new ApiError(400, "Payment verification failed");
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: "paid" },
      { new: true }
    );
    if (!payment) throw new ApiError(404, "Payment record not found");

    const booking = await Booking.findById(payment.booking);

    if (payment.purpose === "advance") {
      booking.status = "confirmed";
      booking.timeline.bookingConfirmedAt = booking.timeline.bookingConfirmedAt || new Date();
      booking.timeline.advancePaidAt = new Date();

      const dateCursor = new Date(booking.checkIn);
      const dates = [];
      while (dateCursor < booking.checkOut) {
        dates.push(new Date(dateCursor));
        dateCursor.setUTCDate(dateCursor.getUTCDate() + 1);
      }
      await Availability.bulkWrite(
        dates.map((d) => ({
          updateOne: {
            filter: { villa: booking.villa, date: d },
            update: { $set: { status: "booked", booking: booking._id } },
            upsert: true,
          },
        }))
      );
    } else {
      booking.timeline.checkInAt = booking.timeline.checkInAt || new Date();
    }

    await booking.save();

    res.status(200).json(new ApiResponse(200, { booking, payment }, "Payment verified successfully"));
  } catch (error) {
    next(error);
  }
};