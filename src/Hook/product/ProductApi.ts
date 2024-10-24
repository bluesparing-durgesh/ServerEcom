import { AxiosResponse } from "axios";
import { IApiError } from "../../utils/statuses";
import {
  DeleteProductRes,
  IaddOrUpdateProductRes,
  IgetProductRes,
  IProduct,
  ISearchSuggestionRes,
  IUpdateProductRes,
  IUpdateRatingPayload,
  IUploadExcelRes,
} from "./Iproduct";
import { request } from "../../utils/axiosClient";

export const addProduct = async (
  data: IProduct
): Promise<IaddOrUpdateProductRes> => {
  const response: AxiosResponse<IaddOrUpdateProductRes> = await request<
    IaddOrUpdateProductRes,
    IApiError
  >({
    url: "/product/add",
    method: "post",
    data,
  });
  return response.data;
};

export const addProductExcel = async (file: File): Promise<IUploadExcelRes> => {
  const formData = new FormData();
  formData.append("file", file);
  const response: AxiosResponse<IUploadExcelRes> =
    await request<IUploadExcelRes>({
      url: "/product/upload-excel",
      method: "post",
      data: formData,
    });

  return response.data;
};

export const getProducts = async ({
  pageParam,
}: any): Promise<IgetProductRes> => {
  const response: AxiosResponse<IgetProductRes> = await request<
    IgetProductRes,
    IApiError
  >({
    url: `product/get?page=${pageParam}&limit=6`,
    method: "get",
  });
  return response.data;
};

export const getAllProducts = async (): Promise<IgetProductRes> => {
  const response: AxiosResponse<IgetProductRes> = await request<
    IgetProductRes,
    IApiError
  >({
    url: `product/get-all`,
    method: "get",
  });
  return response.data;
};

export const getFilterProducts = async (
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  rating?: number
): Promise<IgetProductRes> => {
  // Initialize the base URL
  let url = `product/filter`;

  // Create an array of query parameters
  const queryParams: string[] = [];

  // Check each value and append if it's defined
  if (category) queryParams.push(`category=${encodeURIComponent(category)}`);
  if (minPrice !== undefined) queryParams.push(`minPrice=${minPrice}`);
  if (maxPrice !== undefined) queryParams.push(`maxPrice=${maxPrice}`);
  if (rating !== undefined) queryParams.push(`rating=${rating}`);
  if (queryParams.length > 0) {
    url += `?${queryParams.join("&")}`;
  }

  const response: AxiosResponse<IgetProductRes> = await request<
    IgetProductRes,
    IApiError
  >({
    url,
    method: "get",
  });

  return response.data;
};

export const updateProduct = async (
  data: IProduct
): Promise<IaddOrUpdateProductRes> => {
  console.log(".....", data);
  const response: AxiosResponse<IaddOrUpdateProductRes> = await request<
    IaddOrUpdateProductRes,
    IApiError
  >({
    url: `/product/update/${data._id}`,
    method: "put",
    data,
  });
  return response.data;
};

export const deletProduct = async (id: string): Promise<DeleteProductRes> => {
  const res: AxiosResponse<DeleteProductRes> = await request<
    DeleteProductRes,
    IApiError
  >({
    url: `/product/delete/${id}`,
    method: "delete",
  });
  return res.data;
};

export const updateRatingProduct = async (
  data: IUpdateRatingPayload
): Promise<IUpdateProductRes> => {
  const res: AxiosResponse<IUpdateProductRes> = await request<
    IUpdateProductRes,
    IApiError
  >({
    url: `/product/update-rating`,
    method: "put",
    data,
  });
  return res.data;
};
export const getSerachSuggestion = async (
  q: string
): Promise<ISearchSuggestionRes> => {
  const res: AxiosResponse<ISearchSuggestionRes> = await request<
    ISearchSuggestionRes,
    IApiError
  >({
    url: `/product/search-suggestions?q=${q} `,
    method: "get",
  });
  return res.data;
};
