import { IUser } from "../../utils/statuses";
import { IProduct } from "../product/Iproduct";

export interface IGetProductReview {
  _id: string;
  user: IUser;
  product: string;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
  __v?: Number;
}
export interface IGetUserReview {
  _id: string;
  user: string;
  product: IProduct;
  rating: string;
  review?: string;
  createdAt: string;
  updatedAt: string;
  __v?: Number;
}

export interface IGetProductReviewRes {
  success: boolean;
  data: IGetProductReview[];
}

export interface IGetUserReviewRes {
  success: boolean;
  data: IGetUserReview[];
}
export interface ICheckExistReview{
  success:boolean;
}
