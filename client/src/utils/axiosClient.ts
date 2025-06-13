import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import {
  CustomAxiosRequestConfig,
  IApiError,
} from "./statuses";

const url = import.meta.env.VITE_API_BASE_URL
const client = axios.create({ baseURL: url, withCredentials: true });

export const request = <T, E = IApiError>(
  options: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {

  const onSuccess = (response: AxiosResponse<T>): AxiosResponse<T> => response;

  const onError = async (error: AxiosError<E>): Promise<any> => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {

        await axios.put(
          `${url}/user/refreshAccessToken`,
          {}, 
          { withCredentials: true } 
        );
        


        return client(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || error);
  };

  return client(options).then(onSuccess).catch(onError);
};
