import { AxiosResponse } from "axios";
import { IApiError } from "../../types";
import {
  ICheckExistReview,
  IGetProductReviewRes,
  IGetUserReviewRes,
} from "./IReview";
import { request } from "../../utils/axiosClient";

export const getProductReviews = async (
  pid: string
): Promise<IGetProductReviewRes> => {
  const response: AxiosResponse<IGetProductReviewRes> = await request<
    IGetProductReviewRes,
    IApiError
  >({
    url: `/review/get-by-product-id/${pid}`,
    method: "get",
  });
  return response.data;
};

export const getUserReviews = async (
  uid: string
): Promise<IGetUserReviewRes> => {
  const response: AxiosResponse<IGetUserReviewRes> = await request<
    IGetUserReviewRes,
    IApiError
  >({
    url: `/review/get-user-revirew/${uid}`,
    method: "get",
  });
  return response.data;
};
export const checkExistReview = async (
  pid: string
): Promise<ICheckExistReview> => {
  const response: AxiosResponse<ICheckExistReview> = await request<
    ICheckExistReview,
    IApiError
  >({
    url: `/review/check-exist/${pid}`,
    method: "get",
  });
  return response.data;
};
