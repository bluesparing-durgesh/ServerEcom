import { Request, Response } from "express";
import Review from "../models/review";
import { sendErrorResponse } from "../utils/responseHandler";

export const addReview = async (
  product: string,
  user: string,
  rating: Number,
  review?: string
) => {
  try {
    const reviewData = new Review({ product, user, rating, review });
    await reviewData.save();
    return true;
  } catch (error) {
    return false;
  }
};

export const getReviewByProductIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { pId } = req.params;
    const reviews = await Review.find({ product: pId })
      .populate("user")
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, data: reviews });
  } catch (error) {
    return sendErrorResponse(
      res,
      500,
      "Error while getting product  rating & review"
    );
  }
};

export const getReviewByUserIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user } = req.params;
    const reviews = await Review.find({ user })
      .populate("product")
      .sort({ createdAt: -1 });
    res.status(200).send({ success: true, data: reviews });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error while getting user review");
  }
};

export const checkexistReviewController = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { product } = req.params;
    const review = await Review.findOne({ user, product });

    return res.status(200).send({ success: !!review });
  } catch (error) {
    return sendErrorResponse(res, 500, "error checking review exist or not");
  }
};
