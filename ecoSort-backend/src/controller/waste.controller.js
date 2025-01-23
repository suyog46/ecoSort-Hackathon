import asyncHandler from "../utils/asyncHandler.js";
import Waste from "../models/waste.model.js";
import { ApiError } from "../utils/apierror.js";
import ApiResponse from "../utils/ApiResponse.js";


const wasteData=asyncHandler(async(req,res)=>{
  try {
    console.log("Fetching waste data and statistics");

    // Fetch all waste data
    const wastes = await Waste.find();

    // Calculate general statistics
    const totalWastes = wastes.length;
    const totalBiodegradable = wastes.filter(
      (w) => w.type === "biodegradable"
    ).length;
    const totalNonBiodegradable = wastes.filter(
      (w) => w.type === "non_biodegradable"
    ).length;

    // Calculate category-wise counts
    const categoryCounts = ["plastic", "Paper", "cardboard","bottle"].reduce(
      (acc, category) => {
        acc[category] = wastes.filter((w) => w.category === category).length;
        return acc;
      },
      {}
    );

    return res
    .status(201)
    .json(new ApiResponse(201, {
      totalWastes,
      totalBiodegradable,
      totalNonBiodegradable,
      categoryCounts,
    }, "waste data retrieval Success!"));
  } catch (err) {
    console.error("Error fetching waste data:", err);
    throw new ApiError(500,"failed to fetch waste data")
  }
})

export {wasteData};