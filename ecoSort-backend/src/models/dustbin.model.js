import { Schema, model } from "mongoose";
// import {
//   generateAccessToken,
//   generateRefreshToken,
// } from "../services/token.service.js";
// import bcrypt from "bcrypt";

const dustbinSchema = new Schema(
  {
    // userID: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    // wasteID: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Waste", // Reference to the User model
    //   required: true,
    // },
    // dustbinId: {
    //   type: Number,
    //   required: true,
    //   trim: true,
    //   maxLength: 30,
    // },
    isBioFilled:{
      type:Boolean,
    },
    isNonBioFilled:{
      type:Boolean,
    },
    // items: {
    //   type: String,
    //   required: true,
    //   trim: true,
    //   maxLength: 30,
    // },
  },
  {
    timestamps: true,
  }
);

//create a table
const Dustbin = model("Dustbin", dustbinSchema);

export default Dustbin;
