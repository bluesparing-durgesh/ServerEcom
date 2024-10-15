import { buyProductController } from './paymetController';
import { Request, Response } from "express";
import { sendErrorResponse } from "../utils/responseHandler";
import Order, {
  DeliveryStatus,
  IOrderItem,
  PaymentMethod,
} from "../models/order";

import { startSession } from "mongoose";
import Delivery from "../models/delivery";


export const createOrderController = async (req: Request, res: Response) => {
  const session = await startSession();
  session.startTransaction();

  try {
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 400, "User information is missing.");
    }
    const user = req.user._id;
    const {
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
      cardNumber,
      bank,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return sendErrorResponse(res, 400, "No order items provided.");
    }
    if (!shippingAddress) {
      return sendErrorResponse(res, 400, "Shipping address is required.");
    }
    if (!totalPrice || totalPrice <= 0) {
      return sendErrorResponse(res, 400, "Total price must be a positive number.");
    }
    if (!paymentMethod || !Object.values(PaymentMethod).includes(paymentMethod)) {
      return sendErrorResponse(res, 400, "Invalid payment method.");
    }

    let payment = null;
    if (paymentMethod !== PaymentMethod.CASH_ON_DELIVERY) {
      if (!cardNumber || !bank) {
        return sendErrorResponse(res, 400, "Payment information is required for online payment.");
      }

      payment = await buyProductController(user, totalPrice, cardNumber, bank);
      if (!payment) {
        await session.abortTransaction();
        session.endSession();
        return sendErrorResponse(res, 500, "Payment function error.");
      }
    }

    
    const orderData = orderItems.map((ele: IOrderItem) => ({
      shippingAddress,
      name: ele.name,
      image: ele.image,
      totalPrice: ele.price,
      product: ele.product,
      paymentMethod,
      payment: payment || null,
      isPaid: paymentMethod !== PaymentMethod.CASH_ON_DELIVERY,
      isDelivered: DeliveryStatus.ORDERED,
      user,
      quantity: ele.quantity,
    }));

 
    const orders = await Order.insertMany(orderData, { session });

    const deliveryData = orders.map(order => ({
      orderId: order._id,
      currentStatus: DeliveryStatus.ORDERED,
      orderSteps: [
        {
          label: "Order Placed",
          description: "The order has been placed successfully.",
          samay: new Date().toISOString(),
        },
      ],
    }));

   
    await Delivery.insertMany(deliveryData, { session });

 
    await session.commitTransaction();
    session.endSession();

    return res.status(201).send({
      success: true,
      message: "Order and delivery created successfully.",
      orders,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return sendErrorResponse(res, 500, "Error creating order and delivery, please try again.");
  }
};


export const getUserOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 400, "User information is missing.");
    }
    const user = req.user._id;
    const orderRecord = await Order.find({ user });
    return res.status(200).send({
      success: true,
      message: "order feched successfully",
      order: orderRecord,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error getting user order");
  }
};
