import { AxiosResponse } from "axios";
import { IApiError, IOrderForm } from "../../utils/statuses";
import { request } from "../../utils/axiosClient";
import {
  IOrderResponse,
  IUserAllOrderRes,
  RefundRes,
  UpdateOrderProps,
} from "./IOrder";

export const addOrder = async (data: IOrderForm): Promise<IOrderResponse> => {
  const response: AxiosResponse<IOrderResponse> = await request<
    IOrderResponse,
    IApiError
  >({
    url: "/order/add",
    method: "post",
    data,
  });
  return response.data;
};
export const getOrder = async (): Promise<IUserAllOrderRes> => {
  const response: AxiosResponse<IUserAllOrderRes> = await request<
    IUserAllOrderRes,
    IApiError
  >({
    url: "/order/get",
    method: "get",
  });
  return response.data;
};
export const getAllOrder = async (): Promise<IUserAllOrderRes> => {
  const response: AxiosResponse<IUserAllOrderRes> = await request<
    IUserAllOrderRes,
    IApiError
  >({
    url: "/order/get-all",
    method: "get",
  });
  return response.data;
};

export const refundOrder = async (
  data: UpdateOrderProps
): Promise<RefundRes> => {
  const response: AxiosResponse<RefundRes> = await request<
    RefundRes,
    IApiError
  >({
    url: "/order/refund",
    method: "put",
    data,
  });
  return response.data;
};

export const updatePayOrder = async (
  data: UpdateOrderProps
): Promise<RefundRes> => {
  const response: AxiosResponse<RefundRes> = await request<
    RefundRes,
    IApiError
  >({
    url: "/order/update-payment",
    method: "put",
    data,
  });
  return response.data;
};
export const getOrderById = async (id: string): Promise<RefundRes> => {
  const response: AxiosResponse<RefundRes> = await request<
    RefundRes,
    IApiError
  >({
    url: `/order/get-byId/${id}`,
    method: "get",
  });
  return response.data;
};
