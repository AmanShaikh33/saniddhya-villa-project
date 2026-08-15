import multer from "multer";
import { villaImageStorage, guestIdStorage } from "../config/cloudinary.js";

export const uploadVillaImage = multer({
  storage: villaImageStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
});

export const uploadGuestId = multer({
  storage: guestIdStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG or PDF files are allowed"), false);
  },
});