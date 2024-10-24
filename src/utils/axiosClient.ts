import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { IApiError } from "./statuses";

const url = "https://serverecom.onrender.com/api/v1"
// const url = "http://localhost:8000/api/v1";
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
    // const originalRequest = error.config as CustomAxiosRequestConfig;

    // Check for 401 status code
    // if (error.response && error.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true; // Prevent infinite loop

    //   try {
    //     const refreshToken = localStorage.getItem("refreshToken"); // Get refresh token from local storage
    //     const refreshTokenResponse = await axios.post("http://localhost:8000/api/v1/refresh-token", {
    //       token: refreshToken
    //     });

    //     const newAccessToken = refreshTokenResponse.data.token; // Assuming the new token is in this format

    //     // Set new token in local storage
    //     localStorage.setItem("accessToken", newAccessToken);
    //     client.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

    //     // Retry the original request with the new token
    //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    //     return client(originalRequest);
    //   } catch (refreshError) {
    //     return Promise.reject(refreshError);
    //   }
    // }

    return Promise.reject(error.response?.data || error);
  };

  return client(options).then(onSuccess).catch(onError);
};
