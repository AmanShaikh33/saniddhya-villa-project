import Villa from "../models/Villa.model.js";
import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getAllVillas = async (req, res, next) => {
  try {
    const villas = await Villa.find({ isActive: true }).select(
      "name tagline city state pricePerNight rating reviewCount coverImage maxGuests bedrooms"
    );
    res.status(200).json(new ApiResponse(200, villas));
  } catch (error) {
    next(error);
  }
};

export const getVillaById = async (req, res, next) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) throw new ApiError(404, "Villa not found");
    res.status(200).json(new ApiResponse(200, villa));
  } catch (error) {
    next(error);
  }
};

export const getVillaGallery = async (req, res, next) => {
  try {
    const villa = await Villa.findById(req.params.id).select("gallery name");
    if (!villa) throw new ApiError(404, "Villa not found");

    const { category } = req.query;
    const gallery = category && category !== "All"
      ? villa.gallery.filter((img) => img.category === category)
      : villa.gallery;

    res.status(200).json(new ApiResponse(200, gallery));
  } catch (error) {
    next(error);
  }
};

export const addGalleryImage = async (req, res, next) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) throw new ApiError(404, "Villa not found");
    if (!req.file) throw new ApiError(400, "Image file is required");

    const { category, caption } = req.body;

    villa.gallery.push({
      url: req.file.path,
      publicId: req.file.filename,
      category,
      caption,
    });

    await villa.save();
    res.status(201).json(new ApiResponse(201, villa.gallery, "Image added to gallery"));
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryImage = async (req, res, next) => {
  try {
    const villa = await Villa.findById(req.params.id);
    if (!villa) throw new ApiError(404, "Villa not found");

    const { publicId } = req.params;
    const decodedPublicId = decodeURIComponent(publicId);

    await cloudinary.uploader.destroy(decodedPublicId);
    villa.gallery = villa.gallery.filter((img) => img.publicId !== decodedPublicId);

    await villa.save();
    res.status(200).json(new ApiResponse(200, villa.gallery, "Image removed"));
  } catch (error) {
    next(error);
  }
};