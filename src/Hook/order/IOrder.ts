import { IOrderForm, IShippingAddress, OrderItem } from "../../types";

enum DeliveryStatus {
  ORDERED = "order complete",
  SHIPPED = "shipped",
  OUT_OF_DELIVERY = "out of delivery",
  DELIVERED = "delivered",
  Canceled = "canceled",
  Refunding = "redunding",
  Refunded = "redund complete",
}
enum PaymentMethod {
  ONLINE = "Online",
  CASH_ON_DELIVERY = "Cash on Delivery",
}

export interface IOrderResponse {
  success: boolean;
  message: string;
  order: {
    user: string;
    orderItems: OrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: PaymentMethod;
    payment: string;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: DeliveryStatus;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface IOrder {
  shippingAddress: IShippingAddress;
  _id: string;
  user: string;
  name: string;
  quantity: number;
  image: string;
  product: string;
  paymentMethod: PaymentMethod;
  payment: string | null;
  refund: string | null;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: DeliveryStatus;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUserAllOrderRes {
  success: boolean;
  message?: string;
  order: IOrder[];
}

export interface UpdateOrderProps {
  orderId: string;
  userId?: string;
  amount: number;
  cardNumber: number;
  bank: string;
}

export interface RefundRes {
  order: IOrder;
}