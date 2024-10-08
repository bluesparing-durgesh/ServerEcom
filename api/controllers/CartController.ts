import { Request, Response } from "express";
import Cart from "../models/cart";
import { sendErrorResponse } from "../utils/responseHandler";

export const createCartEntry = async (req: Request, res: Response) => {
  try {
    const { product } = req.body as { product: string };
    const user = req.user._id;
    if (!user || !product) {
      return sendErrorResponse(res, 400, "User and product are required");
    }
    const cartEntry = await Cart.findOneAndUpdate(
      { user, product },
      { $inc: { quantity: 1 } },
      { new: true, upsert: true }
    );

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in adding product to cart");
  }
};

// Get All Cart Entries for a User
export const getUserCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const cartEntries = await Cart.find({ user: userId }).populate("product");
    return res.status(200).json({
      success: true,
      cartEntries,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in fetching cart entries");
  }
};

// Update Cart Entry
export const updateCartEntry = async (req: Request, res: Response) => {
  try {
    const { cartId, quantity } = req.body as {
      cartId: string;
      quantity: number;
    };

    // Validate input
    if (!cartId || typeof quantity !== "number") {
      return sendErrorResponse(res, 400, "Cart ID and quantity are required");
    }

    const updatedCartEntry = await Cart.findByIdAndUpdate(
      cartId,
      { quantity },
      { new: true }
    );

    if (!updatedCartEntry) {
      return sendErrorResponse(res, 404, "Cart entry not found");
    }

    return res.status(200).json({
      success: true,
      message: "Cart entry updated successfully",
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in updating cart entry");
  }
};

export const deleteCartEntry = async (req: Request, res: Response) => {
  try {
    const { cartId } = req.body as { cartId: string };

    if (!cartId) {
      return sendErrorResponse(res, 400, "Cart ID is required");
    }

    const deletedCartEntry = await Cart.findByIdAndDelete(cartId);

    if (!deletedCartEntry) {
      return sendErrorResponse(res, 404, "Cart entry not found");
    }

    return res.status(200).json({
      success: true,
      message: "Cart entry deleted successfully",
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in deleting cart entry");
  }
};
