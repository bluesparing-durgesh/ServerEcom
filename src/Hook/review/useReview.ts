import { useQuery } from "@tanstack/react-query";
import {
  ICheckExistReview,
  IGetProductReviewRes,
  IGetUserReviewRes,
} from "./IReview";
import { IApiError } from "../../utils/statuses";
import {
  checkExistReview,
  getProductReviews,
  getUserReviews,
} from "./ReviewApi";

export const useGetProductReviews = (pid: string) => {
  return useQuery<IGetProductReviewRes, IApiError>({
    queryKey: ["reviewByPId"],
    queryFn: () => getProductReviews(pid),
  });
};
export const useGetUserReviews = (uid: string) => {
  return useQuery<IGetUserReviewRes, IApiError>({
    queryKey: ["reviewByuId"],
    queryFn: () => getUserReviews(uid),
  });
};
export const useChckReviews = (pid: string) => {
  return useQuery<ICheckExistReview, IApiError>({
    queryKey: ["checkReviewExist"],
    queryFn: () => checkExistReview(pid),
  });
};
