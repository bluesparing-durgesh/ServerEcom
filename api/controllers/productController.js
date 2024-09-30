"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProductByExcel = exports.getProductByNameController = exports.filterProductsController = exports.getAllProductsController = exports.getProductByIdController = exports.deleteProductController = exports.updateProductController = exports.createProductController = void 0;
const slugify_1 = __importDefault(require("slugify"));
const product_1 = __importDefault(require("../models/product"));
const responseHandler_1 = require("../utils/responseHandler");
const xlsx_1 = __importDefault(require("xlsx"));
const category_1 = __importDefault(require("../models/category"));
const createProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, image, category, quantity, shipping, rating, } = req.body;
        if (!name || !description || !price || !category || !quantity || !rating) {
            return (0, responseHandler_1.sendErrorResponse)(res, 400, "All fields is neccessary");
        }
        const existAlready = yield product_1.default.findOne({ name });
        if (existAlready) {
            return (0, responseHandler_1.sendErrorResponse)(res, 409, "already exist");
        }
        const product = new product_1.default(Object.assign(Object.assign({}, req.body), { slug: (0, slugify_1.default)(name) }));
        yield product.save();
        return res.status(201).send({
            success: true,
            message: "Product is craeted successfully",
            product,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in making product");
    }
});
exports.createProductController = createProductController;
const updateProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        let updates = req.body;
        if (!!name) {
            updates = Object.assign(Object.assign({}, req.body), { slug: (0, slugify_1.default)(name) });
        }
        if (!id || Object.keys(updates).length === 0) {
            return (0, responseHandler_1.sendErrorResponse)(res, 400, "Product ID and updates are required");
        }
        const updatedProduct = yield product_1.default.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!updatedProduct) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Product not found");
        }
        return res.status(200).send({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in updating product");
    }
});
exports.updateProductController = updateProductController;
const deleteProductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return (0, responseHandler_1.sendErrorResponse)(res, 400, "Product ID is required");
        }
        const deletedProduct = yield product_1.default.findByIdAndDelete(id);
        if (!deletedProduct) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Product not found");
        }
        return res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in deleting product");
    }
});
exports.deleteProductController = deleteProductController;
const getProductByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return (0, responseHandler_1.sendErrorResponse)(res, 400, "Product ID is required");
        }
        const product = yield product_1.default.findById(id);
        if (!product) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Product not found");
        }
        return res.status(200).send({
            success: true,
            product,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in retrieving product");
    }
});
exports.getProductByIdController = getProductByIdController;
const getAllProductsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const products = yield product_1.default.find().limit(limit).skip(skip);
        const totalProducts = yield product_1.default.countDocuments();
        return res.status(200).send({
            success: true,
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in retrieving products");
    }
});
exports.getAllProductsController = getAllProductsController;
const filterProductsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { minPrice, maxPrice, rating, category, page, limit, name } = req.query;
        let pageNumber = page ? parseInt(page, 10) : 1;
        let limitNumber = limit ? parseInt(limit, 10) : 5;
        const filter = {};
        // Build the filter based on query parameters
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
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
        const products = yield product_1.default.find(filter).limit(limitNumber).skip(skip);
        // Get total count of filtered products
        const totalProducts = yield product_1.default.countDocuments(filter);
        return res.status(200).send({
            success: true,
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limitNumber),
            currentPage: page,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in filtering products");
    }
});
exports.filterProductsController = filterProductsController;
const getProductByNameController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        if (!name) {
            return (0, responseHandler_1.sendErrorResponse)(res, 400, "Product name is required");
        }
        const product = yield product_1.default.findOne({ name });
        if (!product) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Product not found");
        }
        return res.status(200).send({
            success: true,
            product,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in retrieving product");
    }
});
exports.getProductByNameController = getProductByNameController;
const giveCate_id = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const normalizedName = name.toLowerCase().trim();
    const category = yield category_1.default.findOneAndUpdate({ name: normalizedName }, { $setOnInsert: { name: normalizedName, slug: (0, slugify_1.default)(normalizedName) } }, { new: true, upsert: true, returnOriginal: false });
    return category._id;
});
const AddProductByExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const workbook = xlsx_1.default.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const filterExistProduct = yield Promise.all(worksheet.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield product_1.default.findOne({ name: item.name });
            return product ? null : item;
        })));
        const productsToInsert = filterExistProduct.filter((item) => item !== null);
        if (productsToInsert.length > 0) {
            const products = yield Promise.all(productsToInsert.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                let categoryId;
                try {
                    categoryId = yield giveCate_id(item.category);
                }
                catch (error) {
                    console.error(`Error while creating/finding category: ${item.category}`, error);
                    return res.status(500).json({
                        message: `Error while processing category: ${item.category}`,
                    });
                }
                return {
                    name: item.name,
                    slug: (0, slugify_1.default)(item.name),
                    price: item.price,
                    image: item.image,
                    description: item.description,
                    category: categoryId,
                    rating: parseFloat(item.rating) || 0,
                    quantity: parseInt(item.quantity, 10) || 0,
                };
            })));
            // Filter out null products in case of any errors
            const validProducts = products.filter((product) => product !== null);
            if (validProducts.length > 0) {
                yield product_1.default.insertMany(validProducts);
                return res.status(200).json({ message: "Products added successfully" });
            }
            else {
                return res.status(409).json({ message: "No valid products to add" });
            }
        }
        else {
            return res.status(409).json({ message: "Products already exist" });
        }
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error while uploading excel");
    }
});
exports.AddProductByExcel = AddProductByExcel;
