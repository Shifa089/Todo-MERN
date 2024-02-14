import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { deleteCloudinary, uploadCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    // console.log("access token: ", accessToken, " refreshtoken: ", refreshToken);
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get data from body
  //check if data is available
  //validate email
  //check if user exists
  //take profile pic
  //upload on cloudinary
  //create user
  //remove password and refreshtoken from response
  //validate if user is created
  //return response

  const { fullName, email, password } = req.body;
  if (fullName === "" || email === "" || password === "") {
    throw new ApiError(406, "All fields are required");
  }

  let validEmailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(validEmailRegex)) {
    throw new ApiError(400, "invalid mail-id");
  }

  const localFilePath = req.file?.path;
  if (!localFilePath) {
    throw new ApiError(406, "Profile photo required");
  }

  const existedUser = await User.findOne({ email: email });
  if (existedUser) {
    fs.unlinkSync(localFilePath);
    throw new ApiError(400, "User email already exists");
  }

  // console.log("files: ", req.file);

  const profilePhoto = await uploadCloudinary(localFilePath);
  if (!profilePhoto.url) {
    throw new ApiError(500, "Something went wrong while uploading");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    profilePhoto: profilePhoto.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(406, "email and password required");
  }

  // console.log(email, password)

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exist pls signup");
  }

  const isPasswirdCorrect = await user.isPasswordCorrect(password);
  if (!isPasswirdCorrect) {
    throw new ApiError(400, "Invalid login credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  // console.log("access token: ", accessToken, " refreshtoken: ", refreshToken);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user?._id, {
    $unset: {
      refreshToken: 1,
    },
  });

  return res
    .status(201)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(201)
    .json(new ApiResponse(201, req.user, "User data fetched successfully"));
});

const updateAccount = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body;

  if (!email || !fullName) {
    throw new ApiError(406, "email and fullName required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User updated successfully"));
});

const updatePassowrd = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(406, "Passwords required");
  }
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Updated Successfully"));
});

const updateProfilePhoto = asyncHandler(async (req, res) => {
  const oldLink = req.user?.profilePhoto;
  // console.log("old link: ", oldLink);
  const newLocalPath = req.file?.path;
  if (!newLocalPath) {
    throw new ApiError(406, "New photo required");
  }

  const profilePhoto = await uploadCloudinary(newLocalPath);
  if (!profilePhoto.url) {
    throw new ApiError(
      500,
      "Something went wrong on the server while uploading pic"
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profilePhoto: profilePhoto.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!oldLink) {
    throw new ApiError(
      500,
      "Something went wrong on the server while deleting old pic"
    );
  }
  const regex = /\/([^/]+)\.[^.\/]+$/;
  const match = oldLink.match(regex);
  const oldId = match ? match[1] : null;
  // console.log("Old id: ", oldId);
  const oldProfilePhoto = await deleteCloudinary(oldId);
  // console.log("old profile: ", oldProfilePhoto);
  if (oldProfilePhoto.result !== "ok") {
    throw new ApiError(
      500,
      "Something went wrong on the server while deleting old pic"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { user }, "Profile photo updated successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToekn = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToekn?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // console.log("Refresh token: ",refreshToken);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Acess token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAccount,
  updatePassowrd,
  updateProfilePhoto,
  refreshAccessToken,
};
