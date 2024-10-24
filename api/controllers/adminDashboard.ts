import { Request, Response } from "express";
import Product from "../models/product";
import Category from "../models/category";
import Order from "../models/order";
import { sendErrorResponse } from "../utils/responseHandler";

export const getDashboardStats = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user;
    if (!user) {
      return sendErrorResponse(res, 400, "user information is required");
    }

    if (user.role.toLowerCase() !== "admin") {
      return sendErrorResponse(res, 400, "only admin can access");
    }
    const productCount: number = await Product.countDocuments();
    const categoryCount: number = await Category.countDocuments();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const orderStats = await Order.aggregate([
      {
        $facet: {
          yearly: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(`${currentYear}-01-01`),
                  $lte: new Date(`${currentYear}-12-31`),
                },
              },
            },
            {
              $group: {
                _id: "$isDelivered",
                count: { $sum: 1 },
              },
            },
          ],

          monthly: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(`${currentYear}-${currentMonth}-01`),
                  $lt: new Date(`${currentYear}-${currentMonth + 1}-01`),
                },
              },
            },
            {
              $group: {
                _id: "$isDelivered",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json({
      productCount,
      categoryCount,
      orderStats: {
        yearly: orderStats[0].yearly,
        monthly: orderStats[0].monthly,
      },
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "error while getting dashboard api");
  }
};
