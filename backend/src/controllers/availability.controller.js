import Availability from "../models/Availability.model.js";
import Villa from "../models/Villa.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getMonthAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { month, year } = req.query;

    if (!month || !year) throw new ApiError(400, "month and year query params are required");

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    const records = await Availability.find({
      villa: id,
      date: { $gte: startDate, $lte: endDate },
    }).select("date status note -_id");

    res.status(200).json(new ApiResponse(200, records));
  } catch (error) {
    next(error);
  }
};

export const checkRangeAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body;

    if (!checkIn || !checkOut) throw new ApiError(400, "checkIn and checkOut are required");

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start) throw new ApiError(400, "Check-out must be after check-in");

    const conflict = await Availability.findOne({
      villa: id,
      date: { $gte: start, $lt: end },
      status: { $in: ["booked", "blocked"] },
    });

    const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));

    if (conflict) {
      return res.status(200).json(
        new ApiResponse(200, { available: false, nights }, "Some dates in this range are unavailable")
      );
    }

    const villa = await Villa.findById(id).select("pricePerNight taxPercent securityDeposit advancePercent");

    res.status(200).json(
      new ApiResponse(200, { available: true, nights, villa }, "Dates are available")
    );
  } catch (error) {
    next(error);
  }
};

export const blockDates = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dates, note } = req.body;

    const ops = dates.map((d) => ({
      updateOne: {
        filter: { villa: id, date: new Date(d) },
        update: { $set: { status: "blocked", note: note || "Maintenance" } },
        upsert: true,
      },
    }));

    await Availability.bulkWrite(ops);
    res.status(200).json(new ApiResponse(200, null, "Dates blocked"));
  } catch (error) {
    next(error);
  }
};