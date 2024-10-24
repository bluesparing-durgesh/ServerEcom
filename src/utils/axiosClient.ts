import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import {
  CustomAxiosRequestConfig,
  IApiError,
  IRefreshTokenRes,
} from "./statuses";

const url = "https://serverecom.onrender.com/api/v1"
// const url = "http://localhost:4000/api/v1";
const client = axios.create({ baseURL: url });

export const request = <T, E = IApiError>(
  options: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  const onSuccess = (response: AxiosResponse<T>): AxiosResponse<T> => response;

  const onError = async (error: AxiosError<E>): Promise<any> => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevent infinite loop

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const refreshTokenResponse: AxiosResponse<IRefreshTokenRes, IApiError> =
          await axios.put(`${url}/user/refreshAccessToken`, {
            refreshToken: refreshToken,
          });

        const newAccessToken = refreshTokenResponse.data.accessToken;
        const newRefreshToken = refreshTokenResponse.data.refreshToken;
        // Set new token in local storage
        localStorage.setItem("accessToken", newAccessToken);

        localStorage.setItem("refreshToken", newRefreshToken);
        client.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || error);
  };

  return client(options).then(onSuccess).catch(onError);
};
