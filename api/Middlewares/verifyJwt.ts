import { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "../utils/responseHandler";
import jwt from "jsonwebtoken";
import User from "../models/user";

export const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return sendErrorResponse(res, 401, "Unauthorized request");
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
      return sendErrorResponse(res, 500, "Access token secret not configured");
    }

    const decodedToken = jwt.verify(token, accessTokenSecret) as { _id: string }; 
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      return sendErrorResponse(res, 401, "Invalid Access Token");
    }
  
    req.user = user;
    next();
  } catch (error) {
    sendErrorResponse(res, 500, "token Internal server error");
  }
};
