import { AxiosResponse } from "axios";

import { request } from "../../utils/axiosClient";
import { IApiError } from "../../types";
import {
  IApiSuccess,
  ICancelDeliveryPayload,
  IDeliveryRes,
  IUpdateDeliveryPayload,
} from "./IDelivery";

export const getDelivery = async (orderId: string): Promise<IDeliveryRes> => {
  const response: AxiosResponse<IDeliveryRes> = await request<
    IDeliveryRes,
    IApiError
  >({
    url: `delivery/get/${orderId}`,
    method: "get",
  });
  return response.data;
};

export const updateDelivery = async (
  data: IUpdateDeliveryPayload,
  id: string
): Promise<IDeliveryRes> => {
  const response: AxiosResponse<IDeliveryRes> = await request<
    IDeliveryRes,
    IApiError
  >({
    url: `delivery/update/${id}`,
    method: "put",
    data,
  });
  return response.data;
};
export const updateCancelDelivery = async (
  data: ICancelDeliveryPayload,
  id: string
): Promise<IApiSuccess> => {
  const response: AxiosResponse<IApiSuccess> = await request<
    IApiSuccess,
    IApiError
  >({
    url: `delivery/update-cancel/${id}`,
    method: "put",
    data,
  });
  return response.data;
};
