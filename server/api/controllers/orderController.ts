import {
  buyProductController,
  refundProductController,
} from "./paymetController";
import { Request, Response } from "express";
import { sendErrorResponse } from "../utils/responseHandler";
import Order, {
  DeliveryStatus,
  IOrderItem,
  PaymentMethod,
} from "../models/order";

import { startSession } from "mongoose";
import Delivery from "../models/delivery";
import Product from "../models/product";

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
      return sendErrorResponse(
        res,
        400,
        "Total price must be a positive number."
      );
    }
    if (
      !paymentMethod ||
      !Object.values(PaymentMethod).includes(paymentMethod)
    ) {
      return sendErrorResponse(res, 400, "Invalid payment method.");
    }

    let payment = null;
    if (paymentMethod !== PaymentMethod.CASH_ON_DELIVERY) {
      if (!cardNumber || !bank) {
        return sendErrorResponse(
          res,
          400,
          "Payment information is required for online payment."
        );
      }

      payment = await buyProductController(user, totalPrice, cardNumber, bank);
      if (!payment) {
        await session.abortTransaction();
        session.endSession();
        return sendErrorResponse(res, 500, "Payment function error.");
      }
    }
    let productIds: string[] = [];
    const orderData = orderItems.map((ele: IOrderItem) => {
      productIds.push(ele.product.toString());
      return {
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
      };
    });

    const orders = await Order.insertMany(orderData, { session });

    const deliveryData = orders.map((order) => ({
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
    await Product.updateMany(
      { _id: { $in: productIds } },
      {
        $inc: { quantity: -1 },
      },
      { session }
    );
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
    return sendErrorResponse(
      res,
      500,
      "Error creating order and delivery, please try again."
    );
  }
};

export const getUserOrderController = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 400, "User information is missing.");
    }
    const user = req.user._id;
    const orderRecord = await Order.find({ user }).sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "order feched successfully",
      order: orderRecord,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error getting user order");
  }
};

export const getAllOrderController = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 400, "User information is missing.");
    }

    if (req.user.role !== "admin") {
      return sendErrorResponse(res, 403, "only admin can access .");
    }

    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).send({ success: true, order: orders });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error getting all order");
  }
};

export const refundOrderController = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 400, "User information is missing.");
    }

    if (req.user.role !== "admin") {
      return sendErrorResponse(res, 403, "only admin can access .");
    }

    const { orderId, userId, amount, cardNumber, bank } = req.body;
    if (!orderId || !userId || !amount || !cardNumber || !bank) {
      return sendErrorResponse(res, 404, "All field are required ");
    }

    const paymentId = await refundProductController(
      userId,
      amount,
      cardNumber,
      bank
    );
    if (!paymentId) {
      return sendErrorResponse(res, 500, "redundig payment error");
    }

    const updateOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      {
        $set: {
          refund: paymentId,
          isPaid: false,
        },
      },
      { new: true }
    );

    return res.status(200).send({
      order: updateOrder,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error Refunding payment");
  }
};

export const updateCODProductController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 400, "User information is missing.");
    }
    const userId = req.user._id;
    const { orderId, amount, cardNumber, bank } = req.body;
    if (!orderId || !userId || !amount || !cardNumber || !bank) {
      return sendErrorResponse(res, 404, "All field are required ");
    }

    const paymentId = await buyProductController(
      userId,
      amount,
      cardNumber,
      bank
    );
    if (!paymentId) {
      return sendErrorResponse(res, 500, "update payment error");
    }

    const updateOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      {
        $set: {
          payment: paymentId,
          isPaid: true,
        },
      },
      { new: true }
    );
    return res.status(200).send({
      order: updateOrder,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "error while updating payment ");
  }
};

export const getOrderByOrderIdController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 400, "User information is missing.");
    }
    const { id } = req.params;

    const data = await Order.findById(id);
    return res.status(200).send({ order: data });
  } catch (error) {
    return sendErrorResponse(res, 500, "error while getting  order ");
  }
};
