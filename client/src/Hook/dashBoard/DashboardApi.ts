
import { request } from "utils/axiosClient";
import { IDashboardResponse } from "./IDashboard";
import { AxiosResponse } from "axios";
import { IApiError } from "utils/statuses";

export const getDashboard = async (): Promise<IDashboardResponse> => {
    const response: AxiosResponse<IDashboardResponse> = await request<
    IDashboardResponse,
      IApiError
    >({
      url: `user/dashboard`,
      method: "get",
    });
    return response.data;
  };
  