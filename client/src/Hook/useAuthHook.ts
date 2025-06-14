import {
  keepPreviousData,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  IApiError,
  IGetAllUserRes,
  IloginPayload,
  IloginRes,
  ILogoutRes,
  ISignupPayload,
  IUser,
} from "../utils/statuses";
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


const logoutUser = async (): Promise<ILogoutRes> => {
  const response: AxiosResponse<ILogoutRes> = await request<ILogoutRes, IApiError>({
    url: "/user/logout",
    method: "POST",

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

export const useLogout = () => {
  return useMutation<ILogoutRes, IApiError,{}>({
    mutationFn: logoutUser,
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
