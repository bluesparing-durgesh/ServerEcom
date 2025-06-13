import slugify from "slugify";
import Category from "../models/category";
import { Request, Response } from "express";
import { sendErrorResponse } from "../utils/responseHandler";

export const createCategoryController = async (req: Request, res: Response) => {
  try {
    const { name } = req.body as { name: string };
    if (!name) {
      return sendErrorResponse(res, 401, "Category name is required");
    }
    const existCategory = await Category.findOne({ name });
    if (existCategory) {
      return sendErrorResponse(res, 409, `${name} already exists`);
    }
    const category = await new Category({ name, slug: slugify(name) }).save();
    return res.status(201).send({
      success: true,
      message: `${name} category created successfully`,
      category,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in creating category");
  }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return sendErrorResponse(res, 404, "Category not found");
    }

    return res.status(200).send({
      success: true,
      message: `${category.name} deleted successfully`,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in deleting category");
  }
};

export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body as { name: string };
    if (!name) {
      return sendErrorResponse(res, 401, "Category name is required");
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    if (!updatedCategory) {
      return sendErrorResponse(res, 404, "Category not found");
    }

    return res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in updating category");
  }
};

export const getCategoryController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return sendErrorResponse(res, 404, "Category not found");
    }
    return res.status(200).send({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in fetching category");
  }
};

export const getAllCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in fetching categories");
  }
};

export const getCategoryByIdController = async (req: Request, res: Response) => {
  try {
    const { cid } = req.params;
    if (!cid) {
      return sendErrorResponse(res, 404, "CategoryID not found");
    }
    const data = await Category.findById(cid);
    return res.send({ success: true, data });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in fetching categories");
  }
};
