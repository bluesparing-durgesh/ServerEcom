import { IApiError } from "utils/statuses";
import { IDashboardResponse } from "./IDashboard";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "./DashboardApi";

export const useGetDashboard = () => {
    return useQuery<IDashboardResponse, IApiError>({
      queryKey: ["dashboard"],
      queryFn: () =>getDashboard(),
     
    });
  };