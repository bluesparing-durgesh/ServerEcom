import { Request, Response } from "express";
import User from "../models/user";
import { sendErrorResponse } from "../utils/responseHandler";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { username, email, fullName, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(res, 400, "User already exists");
    }

    const newUser = new User({ username, email, fullName, password });
    await newUser.save();


    const { password: _, ...userResponse } = newUser.toObject();

    return res.status(201).send({ user: userResponse });
  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error");
  }
};


export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return sendErrorResponse(res, 400, "Invalid email or password");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return sendErrorResponse(res, 400, "Invalid email or password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const { password: _, ...userResponse } = user.toObject();
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none" as "none",
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ user: userResponse });



  } catch (error) {
    return sendErrorResponse(res, 500, "Internal server error");
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    return sendErrorResponse(res, 400, "Refresh token is required.");
  }

  try {

    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { _id: string };


    const user = await User.findById(decoded._id);
    if (!user) {
      return sendErrorResponse(res, 401, "Invalid refresh token.");
    }


    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none" as "none",
    };
    



    return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ success: true, message: "token is refreshed" });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return sendErrorResponse(res, 401, "Refresh token expired.");
    }
    console.error(error);
    return sendErrorResponse(res, 500, "Internal server error.");
  }
};



export const getAllUserController = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    if (!user) {
      return sendErrorResponse(res, 404, "user not found");
    }
    if (user.role.toLowerCase() !== "admin") {
      return sendErrorResponse(res, 403, "only admin can access .");
    }
    const users = await User.find({ role: "user" }).select('-password').sort({ createdAt: -1 });
    return res.status(200).send({ success: true, users });
  } catch (error) {
    return sendErrorResponse(res, 500, "error while fetching user");
  }
};


export const logout = async (req: Request, res: Response) => {
  try {
   
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
      })
      .status(200)
      .json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

