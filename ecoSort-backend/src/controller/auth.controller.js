import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/apierror.js";


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wring while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, fullName, password } = req.body;
  const trimmedEmail = email?.trim();
  const trimmedFullName = fullName?.trim();
  const hasEmptyField = [trimmedEmail, trimmedFullName, password].some(
    (field) => field === ""
  );

  if (hasEmptyField) {
    throw new ApiError(400, "All fields are required and cannot be empty.");
  }
  // console.log(trimmedEmail);
  const existingUser = await User.findOne({ email: trimmedEmail });

  //if email already exists throw error
  if (existingUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: trimmedEmail,
    fullName: trimmedFullName,
    password: hashedPassword,
  });

  if (!user) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { user }, "Registration Success!"));
});
export default registerUser;

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const trimmedEmail = email?.trim();
  if (!password && !trimmedEmail) {
    throw new ApiError(400, "Fields cannot be empty");
  }

  const user = await User.findOne({ email: trimmedEmail });
  if (!user) {
    return res.status(400).send({ error: "User does not exist." });
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(401).send({ error: "Invalid user credentials." });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Expired refresh token");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "User not authenticated"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export const googleLogin = asyncHandler(async (req, res) => {
  const user = req.user; // This is set by Passport during Google OAuth

  if (!user) {
    throw new ApiError(400, "Google login failed");
  }

  try {
    const { access, refresh } = await generateAccessAndRefreshTokens(user);

    res
      .status(200)
      .cookie("accessToken", access, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .cookie("refreshToken", refresh, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });

    const userInfo = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userInfo,
          "User logged in successfully with Google"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Google login failed");
  }
});
