import Payment from "../models/payment";

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
      to: "shop",
    }).save();
    return paymemt._id;
  } catch (error) {
    return "";
  }
};
