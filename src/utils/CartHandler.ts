import { CheckoutProps, IOrderForm } from "../types";

const CART_STORAGE_KEY = "userCart";
const ORDER_STORAGE_KEY = "userOrder";
export const addCartInWeb = (newCartItems: CheckoutProps) => {
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCartItems));
};

export const getCartFromWeb = () => {
  const storedCart = sessionStorage.getItem(CART_STORAGE_KEY);
  return storedCart ? (JSON.parse(storedCart) as CheckoutProps) : [];
};

export const clearWebCart = () => {
  sessionStorage.removeItem(CART_STORAGE_KEY);
};

export const addOrderInWeb = (newCartItems: IOrderForm) => {
  sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(newCartItems));
};

export const getOrderFromWeb = () => {
  const storedCart = sessionStorage.getItem(ORDER_STORAGE_KEY);
  return storedCart ? (JSON.parse(storedCart) as IOrderForm) : [];
};

export const clearOrderWebCart = () => {
  sessionStorage.removeItem(ORDER_STORAGE_KEY);
};
