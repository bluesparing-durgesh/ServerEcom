import { AxiosResponse } from "axios";
import { IApiError } from "../../utils/statuses";
import { request } from "../../utils/axiosClient";
import {
  IAddCartRes,
  ICartPayload,
  ICartRes,
  IDeleteCartRes,
  IGetCountRes,
} from "./ICart";

export const addCart = async (data: ICartPayload): Promise<IAddCartRes> => {
  const response: AxiosResponse<IAddCartRes> = await request<
    IAddCartRes,
    IApiError
  >({
    url: "cart/create",
    method: "post",
    data,
  });
  return response.data;
};

export const getCart = async (): Promise<ICartRes> => {
  const response: AxiosResponse<ICartRes> = await request<ICartRes, IApiError>({
    url: "cart/all",
    method: "get",
  });
  return response.data;
};

export const updateCart = async (
  cartid: string,
  q: number
): Promise<IAddCartRes> => {
  const response: AxiosResponse<IAddCartRes> = await request<
    IAddCartRes,
    IApiError
  >({
    url: `cart/update/${cartid}`,
    method: "put",
    data: { quantity: q },
  });
  return response.data;
};

export const deleteCart = async (cartid: string): Promise<IDeleteCartRes> => {
  const response: AxiosResponse<IAddCartRes> = await request<
    IAddCartRes,
    IApiError
  >({
    url: `cart/delete/${cartid}`,
    method: "delete",
  });
  return response.data;
};

export const deleteUserCart = async (): Promise<IDeleteCartRes> => {
  const response: AxiosResponse<IDeleteCartRes> = await request<
  IDeleteCartRes,
    IApiError
  >({
    url: `cart/delete`,
    method: "delete",
  });
  return response.data;
};

export const getCartCount = async (): Promise<IGetCountRes> => {
  const response: AxiosResponse<IGetCountRes> = await request<
    IGetCountRes,
    IApiError
  >({
    url: "cart/count",
    method: "get",
  });
  return response.data;
};
