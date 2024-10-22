import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import {
  IApiError,
  IGetAllUserRes,
  IloginPayload,
  IloginRes,
  ISignupPayload,
  IUser,
} from "../types";
import { request } from "../utils/axiosClient";
import { AxiosResponse } from "axios";

const loginUser = async (data: IloginPayload): Promise<IloginRes> => {
  const response: AxiosResponse<IloginRes> = await request<
    IloginRes,
    IApiError
  >({
    url: "/user/login",
    method: "post",
    data,
  });
  return response.data;
};

const signupUser = async (data: ISignupPayload): Promise<IUser> => {
  const response: AxiosResponse<IUser> = await request<IUser, IApiError>({
    url: "/user/register",
    method: "post",
    data,
  });
  return response.data;
};

const getAlluser = async (): Promise<IGetAllUserRes> => {
  const response: AxiosResponse<IGetAllUserRes> = await request<
    IGetAllUserRes,
    IApiError
  >({
    url: "/user/get-all",
    method: "get",
  });
  return response.data;
};
export const useLogin = () => {
  return useMutation<IloginRes, IApiError, IloginPayload>({
    mutationFn: loginUser,
  });
};

export const useSignup = () => {
  return useMutation<IUser, IApiError, ISignupPayload>({
    mutationFn: signupUser,
  });
};

export const useGetUsers = () => {
  return useQuery<IGetAllUserRes, IApiError>({
    queryKey: ["users"],
    queryFn: () => getAlluser(),
    placeholderData: keepPreviousData,
  });
};
