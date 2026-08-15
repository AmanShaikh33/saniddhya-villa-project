import express from "express";
import {
  createBooking,
  updateGuestDetails,
  uploadGovtId,
  getMyBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { uploadGuestId } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/lookup", getMyBookings);
router.get("/:id", getBookingById);
router.patch("/:id/guest-details", updateGuestDetails);
router.post("/:id/guest-id", uploadGuestId.single("govtId"), uploadGovtId);
router.patch("/:id/cancel", cancelBooking);

export default router;