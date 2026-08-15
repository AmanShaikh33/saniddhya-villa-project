import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const villaImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "saniddhya-villas/gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1600, height: 1200, crop: "limit", quality: "auto" }],
  },
});

export const guestIdStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "saniddhya-villas/guest-ids",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

export default cloudinary;