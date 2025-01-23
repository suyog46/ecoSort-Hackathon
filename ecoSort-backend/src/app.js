import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Waste from "./models/waste.model.js";
import wasteRoute from "./routes/waste.routes.js";

const app = express();

app.use(cors());


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// app.get("/api/wastes", async (req, res) => {
//   try {
//     console.log("Fetching waste data and statistics");

//     // Fetch all waste data
//     const wastes = await Waste.find();

//     // Calculate general statistics
//     const totalWastes = wastes.length;
//     const totalBiodegradable = wastes.filter(
//       (w) => w.type === "biodegradable"
//     ).length;
//     const totalNonBiodegradable = wastes.filter(
//       (w) => w.type === "non_biodegradable"
//     ).length;

//     // Calculate category-wise counts
//     const categoryCounts = ["plastic", "Paper", "cardboard","bottle"].reduce(
//       (acc, category) => {
//         acc[category] = wastes.filter((w) => w.category === category).length;
//         return acc;
//       },
//       {}
//     );

//     // Send the data and statistics
//     res.json({
//       totalWastes,
//       totalBiodegradable,
//       totalNonBiodegradable,
//       categoryCounts,
//     });
//   } catch (err) {
//     console.error("Error fetching waste data:", err);
//     res.status(500).json({ message: "Failed to fetch waste data" });
//   }
// });

app.use("/api/waste",wasteRoute);

export default app;
