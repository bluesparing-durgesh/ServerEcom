import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  IOrderResponse,
  IUserAllOrderRes,
  RefundRes,
  UpdateOrderProps,
} from "./IOrder";
import { IApiError, IOrderForm } from "../../utils/statuses";
import {
  addOrder,
  getAllOrder,
  getOrder,
  getOrderById,
  refundOrder,
  updatePayOrder,
} from "./OrderApi";

export const useAddOrder = () => {
  return useMutation<IOrderResponse, IApiError, IOrderForm>({
    mutationFn: addOrder,
  });
};

export const useGetUserOrder = () => {
  return useQuery<IUserAllOrderRes, IApiError>({
    queryKey: ["orders"],
    queryFn: () => getOrder(),
  });
};
export const useGetAllUserOrder = () => {
  return useQuery<IUserAllOrderRes, IApiError>({
    queryKey: ["allOrders"],
    queryFn: () => getAllOrder(),
  });
};

export const useRefundOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<RefundRes, IApiError, UpdateOrderProps>({
    mutationFn: refundOrder,
    onSuccess: (data) => {
      queryClient.setQueryData(["allOrders"], (pre: IUserAllOrderRes) => {
        const newdata = pre.order.map((ele) => {
          if (ele._id === data.order._id) {
            return data.order;
          }
          return ele;
        });
        return {
          ...pre,
          order: [...newdata],
        };
      });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation<RefundRes, IApiError, UpdateOrderProps>({
    mutationFn: updatePayOrder,
    onSuccess: (data) => {
      queryClient.setQueryData(["orders"], (pre: IUserAllOrderRes) => {
        const newdata = pre.order.map((ele) => {
          if (ele._id === data.order._id) {
            return data.order;
          }
          return ele;
        });
        return {
          ...pre,
          order: [...newdata],
        };
      });
    },
  });
};

export const useGetrOrderById = (id: string) => {
  return useQuery<RefundRes, IApiError>({
    queryKey: ["orderById"],
    queryFn: () => getOrderById(id),
  });
};
