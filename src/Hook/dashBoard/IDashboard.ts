import { DeliveryStatus } from "utils/statuses";

export interface IOrderStats {
  _id: DeliveryStatus;
  count: number;
}

export interface IOrderStatsResponse {
  yearly: IOrderStats[];
  monthly: IOrderStats[];
}

export interface IDashboardResponse {
  productCount: number;
  categoryCount: number;
  orderStats: IOrderStatsResponse;
}
