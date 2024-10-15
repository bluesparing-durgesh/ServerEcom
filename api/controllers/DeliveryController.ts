import { Request, Response } from "express";
import Delivery from "../models/Delivery";
import { sendErrorResponse } from "../utils/responseHandler";
import Order, { DeliveryStatus } from "../models/order";
import { startSession } from "mongoose";

export const updateDeliveryController = async (req: Request, res: Response) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { currentStatus, newStep } = req.body;

    // Update the Order status
    const order = await Order.findByIdAndUpdate(
      { orderId },
      { $set: { isDelivered: currentStatus } },
      { new: true, session }
    );

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedDelivery = await Delivery.findOneAndUpdate(
      { orderId },
      {
        $set: { currentStatus },
        $push: { orderSteps: newStep },
      },
      { new: true, session }
    );

    if (!updatedDelivery) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Delivery not found" });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Delivery updated successfully",
      data: updatedDelivery,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return sendErrorResponse(res, 500, "Error updating delivery");
  }
};
export const updateCanceledDeliveryController = async (
  req: Request,
  res: Response
) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const { orderId } = req.params;
    const { newOrderSteps } = req.body;
    const order = await Order.findByIdAndUpdate(
      { orderId },
      { $set: { isDelivered: DeliveryStatus.Canceled } },
      { new: true, session }
    );

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Order not found" });
    }
    const updatedDelivery = await Delivery.updateOne(
      { orderId },
      {
        $set: {
          orderSteps: newOrderSteps,
          currentStatus: DeliveryStatus.Canceled,
        },
      },
      { new: true, session }
    );

    if (!updatedDelivery) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Delivery not found" });
    }
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      message: "Delivery updated successfully",
      data: updatedDelivery,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return sendErrorResponse(res, 500, "Error updating delivery");
  }
};

export const getdeliveryByOrderIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return sendErrorResponse(res, 400, "order id is required");
    }
    const delivery = await Delivery.findOne({ orderId });
    return res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error getting delivery");
  }
};
