import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  IApiSuccess,
  ICancelDeliveryPayload,
  IDeliveryRes,
  IUpdateDeliveryPayload,
} from "./IDelivery";
import { IApiError } from "../../types";
import {
  getDelivery,
  updateCancelDelivery,
  updateDelivery,
} from "./DeliveryApi";

export const useGetDelivery = (orderId: string) => {
  return useQuery<IDeliveryRes, IApiError>({
    queryKey: ["delivery"],
    queryFn: () => getDelivery(orderId),
    placeholderData: keepPreviousData,
  });
};

export const useUpdateDelivery = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IDeliveryRes,
    IApiError,
    { id: string; data: IUpdateDeliveryPayload }
  >({
    mutationFn: ({ id, data }) => updateDelivery(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["allOrders"]);
    },
  });
};

export const useCancelDelivery = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IApiSuccess,
    IApiError,
    { id: string; data: ICancelDeliveryPayload }
  >({
    mutationFn: ({ id, data }) => updateCancelDelivery(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["delivery"]);
    },
  });
};
