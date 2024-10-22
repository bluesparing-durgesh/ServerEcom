import { IProduct } from "../product/Iproduct";

export interface ICartPayload {
  product?: string;
  quantity?: number;
}

export interface IAddCartRes {
  success: boolean;
  message: string;
  cartData: ICart;
}
export interface ICart {
  _id: string;
  product: IProduct;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICartRes {
  success: boolean;
  cartEntries: ICart[];
}

export interface IDeleteCartRes {
  success: boolean;
  message: string;
}

export interface CartMapper {
  [pid: string]: string;
}

export interface IGetCountRes {
  count: number;
}
