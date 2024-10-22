import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  IAddCategoryRes,
  ICategoryPayload,
  IdeleteRes,
  IGetCateByIdRes,
  IgetCategoryRes,
} from "./ICategory";
import { IApiError } from "../../types";
import {
  addCategory,
  deletCategory,
  getCategory,
  getCategoryByid,
  updateCategory,
} from "./CategoryAPI";

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<IAddCategoryRes, IApiError, ICategoryPayload>({
    mutationFn: addCategory,
    onSuccess: (data) => {
      queryClient.setQueryData(["categories"], (pre: IgetCategoryRes) => {
        return {
          ...pre,
          categories: [data.category, ...pre.categories],
        };
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<
    IAddCategoryRes,
    IApiError,
    { id: string; data: ICategoryPayload }
  >({
    mutationFn: ({ id, data }) => updateCategory(data, id),
    onSuccess: (data) => {
      queryClient.setQueryData(["categories"], (pre: IgetCategoryRes) => {
        return {
          ...pre,
          categories: pre.categories.map((category) =>
            category._id === data.category._id ? data.category : category
          ),
        };
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<IdeleteRes, IApiError, string>({
    mutationFn: deletCategory,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["categories"], (pre: IgetCategoryRes) => {
        const newCategories = pre.categories.filter((ele) => ele._id !== id);
        return {
          ...pre,
          categories: newCategories,
        };
      });
    },
  });
};

export const useGetCategories = () => {
  return useQuery<IgetCategoryRes, IApiError>({
    queryKey: ["categories"],
    queryFn: () => getCategory(),
    placeholderData: keepPreviousData,
  });
};

export const useGetCategory = (id: string) => {
  return useQuery<IGetCateByIdRes, IApiError>({
    queryKey: ["category"],
    queryFn: () => getCategoryByid(id),
  });
};
