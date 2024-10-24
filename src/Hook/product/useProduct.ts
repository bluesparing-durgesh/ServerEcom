import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
import {
  addProduct,
  addProductExcel,
  deletProduct,
  getAllProducts,
  getFilterProducts,
  getProducts,
  getSerachSuggestion,
  updateProduct,
  updateRatingProduct,
} from "./ProductApi";

export const useGetProducts = () => {
  return useInfiniteQuery<IgetProductRes, IApiError>({
    queryKey: ["products"],
    queryFn: getProducts,
    initialPageParam: 1,
    getPreviousPageParam: (lastPage) => {
      return lastPage.currentPage! > 1 ? lastPage.currentPage! - 1 : undefined;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage! < lastPage.totalPages!
        ? lastPage.currentPage! + 1
        : undefined;
    },
  });
};

export const useGetAllProducts = () => {
  return useQuery<IgetProductRes, IApiError>({
    queryKey: ["products"],
    queryFn: () => getAllProducts(),
    placeholderData: keepPreviousData,
  });
};
export const useFilterProduct = (
  category: string,
  minPrice?: number,
  maxPrice?: number,
  rating?: number
) => {
  return useQuery<IgetProductRes, IApiError>({
    queryKey: ["filterProduct", category, minPrice, maxPrice, rating],
    queryFn: () => getFilterProducts(category, minPrice, maxPrice, rating),
    enabled:
      Boolean(category) ||
      (minPrice !== undefined && minPrice > 0) ||
      (maxPrice !== undefined && maxPrice < 1000) ||
      (rating !== undefined && rating > 0),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<DeleteProductRes, IApiError, string>({
    mutationFn: deletProduct,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["products"], (pre: IgetProductRes) => {
        const newP = pre.products.filter((ele) => ele._id !== id);

        return {
          ...pre,
          products: [...newP],
        };
      });
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<IaddOrUpdateProductRes, IApiError, IProduct>({
    mutationFn: addProduct,
    onSuccess: (data) => {
      queryClient.setQueryData(["products"], (pre: IgetProductRes) => {
        return {
          ...pre,
          products: [data.product, ...pre.products],
        };
      });
    },
  });
};

export const useAddProductExcel = () => {
  return useMutation<IUploadExcelRes, IApiError, any>({
    mutationFn: addProductExcel,
  });
};
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<IaddOrUpdateProductRes, IApiError, { Pdata: IProduct }>({
    mutationFn: ({ Pdata }) => updateProduct(Pdata),
    onSuccess: (data) => {
      queryClient.setQueryData(["products"], (pre: IgetProductRes) => {
        return {
          ...pre,
          products: pre.products.map((p) =>
            p._id === data.product._id ? data.product : p
          ),
        };
      });
    },
  });
};

export const useUpdateProductRating = () => {
  return useMutation<IUpdateProductRes, IApiError, IUpdateRatingPayload>({
    mutationFn: updateRatingProduct,
  });
};

export const useGetSearchSuggestion = (q: string) => {
  return useQuery<ISearchSuggestionRes, IApiError>({
    queryKey: ["search",q],
    queryFn: () => getSerachSuggestion(q),
  });
};
