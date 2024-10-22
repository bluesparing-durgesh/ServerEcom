
import { AxiosResponse } from "axios";
import {
  IAddCategoryRes,
  ICategoryPayload,
  IdeleteRes,
  IGetCateByIdRes,
  IgetCategoryRes,
} from "./ICategory";
import { request } from "../../utils/axiosClient";
import { IApiError } from "../../types";

export const addCategory = async (
  data: ICategoryPayload
): Promise<IAddCategoryRes> => {
  const response: AxiosResponse<IAddCategoryRes> = await request<
    IAddCategoryRes,
    IApiError
  >({
    url: "category/create", 
    method: "post",
    data,
  });
  return response.data;
};

export const getCategory = async (
): Promise<IgetCategoryRes> => {
  const response: AxiosResponse<IgetCategoryRes> = await request<
    IgetCategoryRes,
    IApiError
  >({
    url: `category/all`,
    method: "get",
  });
  return response.data;
};

export const updateCategory = async (
  data: ICategoryPayload,
  id: string
): Promise<IAddCategoryRes> => {
  const response: AxiosResponse<IAddCategoryRes> = await request<
    IAddCategoryRes,
    IApiError
  >({
    url: `/category/update/${id}`,
    method: "put",
    data,
  });
  return response.data; 
};

export const deletCategory = async (id: string): Promise<IdeleteRes> => {
  const res: AxiosResponse<IdeleteRes> = await request<IdeleteRes, IApiError>({
    url: `/category/delete/${id}`,
    method: "delete",
  });
  return res.data;
};


export const getCategoryByid = async (id:string):Promise<IGetCateByIdRes>=>{
  const res: AxiosResponse<IGetCateByIdRes> = await request<IGetCateByIdRes, IApiError>({
    url: `/category/categoryById/${id}`,
    method: "get",
  });
  return res.data;
}