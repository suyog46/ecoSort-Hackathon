import { Router } from "express";
import { wasteData } from "../controller/waste.controller.js";

const wasteRoute=Router();


wasteRoute.route("/getWasteData").get(wasteData)

export default wasteRoute;