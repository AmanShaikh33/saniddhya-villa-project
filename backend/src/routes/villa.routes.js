import express from "express";
import {
  getAllVillas,
  getVillaById,
  getVillaGallery,
  addGalleryImage,
  deleteGalleryImage,
} from "../controllers/villa.controller.js";
import {
  getMonthAvailability,
  checkRangeAvailability,
  blockDates,
} from "../controllers/availability.controller.js";
import { uploadVillaImage } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", getAllVillas);
router.get("/:id", getVillaById);

router.get("/:id/gallery", getVillaGallery);
router.post("/:id/gallery", uploadVillaImage.single("image"), addGalleryImage);
router.delete("/:id/gallery/:publicId", deleteGalleryImage);

router.get("/:id/availability", getMonthAvailability);
router.post("/:id/availability/check", checkRangeAvailability);
router.patch("/:id/availability/block", blockDates);

export default router;