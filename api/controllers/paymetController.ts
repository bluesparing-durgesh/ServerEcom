import Payment, { PaymentTypes } from "../models/payment";

export const buyProductController = async (
  userId: string,
  amount: number,
  cardNumber: number,
  bank: string
) => {
  try {
    const paymemt = await new Payment({
      amount,
      cardNumber,
      bank,
      from: userId,
      to: "admin",
    }).save();
    return paymemt._id;
  } catch (error) {
    return "";
  }
};

export const refundProductController = async (
  userId: string,
  amount: number,
  cardNumber: number,
  bank: string
) => {
  try {
    const paymemt = await new Payment({
      amount,
      cardNumber,
      bank,
      from: "admin",
      to: userId,
      paymentType: PaymentTypes.REFUND,
    }).save();
    return paymemt._id;
  } catch (error) {
    return "";
  }
};
