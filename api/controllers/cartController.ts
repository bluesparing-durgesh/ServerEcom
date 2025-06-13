import { Request, Response } from "express";
import Cart from "../models/cart";
import { sendErrorResponse } from "../utils/responseHandler";
import Product from "../models/product";

export const createCartEntry = async (req: Request, res: Response) => {
  try {
    const { product } = req.body as { product: string };
    const user = req.user._id;

    if (!user) {
      return sendErrorResponse(res, 400, "User is required");
    }

    if (!product) {
      return sendErrorResponse(res, 400, "Product is required");
    }

    
    const existingProduct = await Product.findById(product);
    if (!existingProduct) {
      return sendErrorResponse(res, 404, "Product not found");
    }

    
    const cartEntry = await Cart.create({ user, product, quantity: 1 });

    
    const cartData = await Cart.findById(cartEntry._id).populate("product");

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
      cartData,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error); 
    return sendErrorResponse(res, 500, "Error in adding product to cart");
  }
};


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


export const updateCartEntry = async (req: Request, res: Response) => {
  try {
    const { quantity } = req.body as {
      quantity: number;
    };
    const { cartId } = req.params;
    
    if (!cartId || typeof quantity !== "number") {
      return sendErrorResponse(res, 400, "Cart ID and quantity are required");
    }

    const cartData = await Cart.findByIdAndUpdate(
      cartId,
      { quantity },
      { new: true }
    ).populate("product");

    if (!cartData) {
      return sendErrorResponse(res, 404, "Cart entry not found");
    }

    return res.status(200).json({
      success: true,
      message: "Cart entry updated successfully",
      cartData,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in updating cart entry");
  }
};

export const deleteCartEntry = async (req: Request, res: Response) => {
  try {
    const { cartId } = req.params as { cartId: string };

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

export const getCartCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const cartEntries = await Cart.find({ user: userId }).countDocuments();
    return res.status(200).send({ count: cartEntries });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in fetching cart counts");
  }
};

export const deleteUserCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    await Cart.deleteMany({ user: userId });
    return res
      .status(200)
      .send({ success: true, message: "all cart item is deleted" });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error delete user cart");
  }
};
