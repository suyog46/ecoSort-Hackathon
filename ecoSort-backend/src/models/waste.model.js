import { Schema, model } from "mongoose";

const wasteSchema = new Schema(
  {
    // dustbinId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Dustbin", // Reference to the Dustbin model
    //   required: true,
    // },
    category: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
  
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the Waste model
const Waste = model("Waste", wasteSchema);

export default Waste;
