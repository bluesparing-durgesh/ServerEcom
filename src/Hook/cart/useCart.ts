import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  IAddCartRes,
  ICartPayload,
  ICartRes,
  IDeleteCartRes,
  IGetCountRes,
} from "./ICart";
import { IApiError } from "../../types";
import {
  addCart,
  deleteCart,
  deleteUserCart,
  getCart,
  getCartCount,
  updateCart,
} from "./CartApi";

export const useAddCart = () => {
  const queryClient = useQueryClient();
  return useMutation<IAddCartRes, IApiError, ICartPayload>({
    mutationFn: addCart,
    onSuccess: (data) => {
      queryClient.setQueryData(["cartsCount"], (pre: IGetCountRes) => {
        const newcount = pre.count + 1;
        return {
          count: newcount,
        };
      });
      queryClient.setQueryData(["carts"], (pre: ICartRes) => {
        return {
          ...pre,
          cartEntries: [data.cartData, ...pre.cartEntries],
        };
      });
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation<IAddCartRes, IApiError, { id: string; q: number }>({
    mutationFn: ({ id, q }) => updateCart(id, q),
    onSuccess: (data) => {
      queryClient.setQueryData(["carts"], (pre: ICartRes) => {
        return {
          ...pre,
          cartEntries: pre.cartEntries.map((cart) =>
            cart._id === data.cartData._id ? data.cartData : cart
          ),
        };
      });
    },
  });
};

export const useDeleteCart = () => {
  const queryClient = useQueryClient();
  return useMutation<IDeleteCartRes, IApiError, string>({
    mutationFn: deleteCart,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["cartsCount"], (pre: IGetCountRes) => {
        const newcount = pre.count - 1;
        return {
          count: newcount,
        };
      });
      queryClient.setQueryData(["carts"], (pre: ICartRes) => {
        const newCarts = pre.cartEntries.filter((ele) => ele._id !== id);
        return {
          ...pre,
          cartEntries: newCarts,
        };
      });
    },
  });
};

export const useDeleteUserCart = () => {
  return useMutation<IDeleteCartRes, IApiError>({
    mutationFn: deleteUserCart,
  });
};

export const useGetCarts = (isUse: boolean) => {
  return useQuery<ICartRes, IApiError>({
    queryKey: ["carts"],
    queryFn: () => getCart(),
    placeholderData: keepPreviousData,
    enabled: isUse,
  });
};
export const useGetCartsCount = (isUse: boolean) => {
  return useQuery<IGetCountRes, IApiError>({
    queryKey: ["cartsCount"],
    queryFn: () => getCartCount(),
    placeholderData: keepPreviousData,
    enabled: isUse,
  });
};
