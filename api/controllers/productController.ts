import { Request, Response } from "express";
import slugify from "slugify";
import Product from "../models/product";
import { sendErrorResponse } from "../utils/responseHandler";
import XLSX from "xlsx";
import Category from "../models/category";
export const createProductController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      quantity,
      shipping,
      rating,
    } = req.body;

    if (!name || !description || !price || !category || !quantity || !rating) {
      return sendErrorResponse(res, 400, "All fields is neccessary");
    }

    const existAlready = await Product.findOne({ name });
    if (existAlready) {
      return sendErrorResponse(res, 409, "already exist");
    }
    const product = new Product({ ...req.body, slug: slugify(name) });

    await product.save();
    return res.status(201).send({
      success: true,
      message: "Product is craeted successfully",
      product,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in making product");
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    let updates = req.body;
    if (!!name) {
      updates = { ...req.body, slug: slugify(name) };
    }

    if (!id || Object.keys(updates).length === 0) {
      return sendErrorResponse(res, 400, "Product ID and updates are required");
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return sendErrorResponse(res, 404, "Product not found");
    }

    return res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in updating product");
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendErrorResponse(res, 400, "Product ID is required");
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return sendErrorResponse(res, 404, "Product not found");
    }

    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in deleting product");
  }
};

export const getProductByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendErrorResponse(res, 400, "Product ID is required");
    }

    const product = await Product.findById(id);

    if (!product) {
      return sendErrorResponse(res, 404, "Product not found");
    }

    return res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in retrieving product");
  }
};

export const getAllProductsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const products = await Product.find().limit(limit).skip(skip);

    const totalProducts = await Product.countDocuments();

    return res.status(200).send({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in retrieving products");
  }
};

export const filterProductsController = async (req: Request, res: Response) => {
  try {
    let { minPrice, maxPrice, rating, category, page, limit, name } = req.query;
    let pageNumber: number = page ? parseInt(page as string, 10) : 1;
    let limitNumber: number = limit ? parseInt(limit as string, 10) : 5;
    const filter: any = {};

    // Build the filter based on query parameters
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    if (category) {
      filter.category = category;
    }
    if (name) {
      filter.name = name;
    }
    // Get pagination parameters

    const skip = (pageNumber - 1) * limitNumber;

    // Fetch filtered products with pagination
    const products = await Product.find(filter).limit(limitNumber).skip(skip);

    // Get total count of filtered products
    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).send({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitNumber),
      currentPage: page,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in filtering products");
  }
};

export const getProductByNameController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.params;

    if (!name) {
      return sendErrorResponse(res, 400, "Product name is required");
    }

    const product = await Product.findOne({ name });

    if (!product) {
      return sendErrorResponse(res, 404, "Product not found");
    }

    return res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "Error in retrieving product");
  }
};

const giveCate_id = async (name: string) => {
  const normalizedName = name.toLowerCase().trim();

  const category = await Category.findOneAndUpdate(
    { name: normalizedName },
    { $setOnInsert: { name: normalizedName, slug: slugify(normalizedName) } },
    { new: true, upsert: true, returnOriginal: false }
  );

  return category._id;
};

export const AddProductByExcel = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const workbook = XLSX.readFile(file!.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const filterExistProduct = await Promise.all(
      worksheet.map(async (item: any) => {
        const product = await Product.findOne({ name: item.name });
        return product ? null : item;
      })
    );

    const productsToInsert = filterExistProduct.filter((item) => item !== null);

    if (productsToInsert.length > 0) {
      const products = await Promise.all(
        productsToInsert.map(async (item: any) => {
          let categoryId;
          try {
            categoryId = await giveCate_id(item.category);
          } catch (error) {
            console.error(
              `Error while creating/finding category: ${item.category}`,
              error
            );
            return res.status(500).json({
              message: `Error while processing category: ${item.category}`,
            });
          }

          return {
            name: item.name,
            slug: slugify(item.name),
            price: item.price,
            image: item.image,
            description: item.description,
            category: categoryId,
            rating: parseFloat(item.rating) || 0,
            quantity: parseInt(item.quantity, 10) || 0,
          };
        })
      );

      // Filter out null products in case of any errors
      const validProducts = products.filter((product) => product !== null);

      if (validProducts.length > 0) {
        await Product.insertMany(validProducts);
        return res.status(200).json({ message: "Products added successfully" });
      } else {
        return res.status(409).json({ message: "No valid products to add" });
      }
    } else {
      return res.status(409).json({ message: "Products already exist" });
    }
  } catch (error) {
    return sendErrorResponse(res, 500, "Error while uploading excel");
  }
};
