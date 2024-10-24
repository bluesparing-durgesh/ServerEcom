import { InternalAxiosRequestConfig } from "axios";

export enum DeliveryStatus {
  ORDERED = "order complete",
  SHIPPED = "shipped",
  OUT_OF_DELIVERY = "out of delivery",
  DELIVERED = "delivered",
  Canceled = "canceled",
  Refunding = "refunding",
  Refunded = "redund complete",
}
export interface IloginPayload {
  username: string;
  password: string;
}
export interface IUser {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthContextType {
  accessToken?: string;
  refreshToken?: string;
  user?: IUser | null;
  login: (accessToken: string, refreshToken: string, user: IUser) => void;
  logout: () => void;
}
export interface IloginRes {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
export interface IApiError {
  success: boolean;
  msg: string;
  statusCode: number;
}
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // Optional property to track retries
}

export interface ISignupPayload {
  username: string;
  email: string;
  fullName: string;
  password: string;
}
export interface SidebarChild {
  title: string;
  icon: JSX.Element;
  element: JSX.Element;
}

export interface SidebarItem {
  id: string;
  title: string;
  icon: JSX.Element;
  link:string;
}


export interface ICategory {
  _id: string;
  name: string;
  slug: string;
}

export interface IFilterProps {
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
  sortBy: string;
  rating: number;
  priceRange: number[];
}

export interface SelectedCategoryProps {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  product: string;
  image: string;
}
export interface CheckoutProps {
  order: OrderItem[];
  totalPrice: number;
}
export enum PaymentMethod {
  ONLINE = "Online",
  CASH_ON_DELIVERY = "Cash on Delivery",
}

export enum IndianBanks {
  SBI = "State Bank of India",
  HDFC = "HDFC Bank",
  ICICI = "ICICI Bank",
  AXIS = "Axis Bank",
  PNB = "Punjab National Bank",
  BOI = "Bank of India",
  CANARA = "Canara Bank",
  IDBI = "IDBI Bank",
  KOTAK = "Kotak Mahindra Bank",
  YES = "YES Bank",
  UNION = "Union Bank of India",
  BOB = "Bank of Baroda",
  INDUSIND = "IndusInd Bank",
  FEDERAL = "Federal Bank",
  UCO = "UCO Bank",
}
export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrderForm {
  user?:string;
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
  orderItems?: OrderItem[];
  totalPrice?:number;
  bank?:string;
  cardNumber:number;
}

export interface IGetAllUserRes{
  success:boolean;
  users:IUser[]
}