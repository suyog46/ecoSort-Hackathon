import { Schema, model } from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/token.service.js";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxLength: 65,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return generateAccessToken(this);
};

userSchema.methods.generateRefreshToken = function () {
  return generateRefreshToken(this);
};

//create a table
const User = model("User", userSchema);

export default User;
