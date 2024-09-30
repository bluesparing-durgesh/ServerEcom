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
exports.getAllCategoriesController = exports.getCategoryController = exports.updateCategoryController = exports.deleteCategoryController = exports.createCategoryController = void 0;
const slugify_1 = __importDefault(require("slugify"));
const category_1 = __importDefault(require("../models/category"));
const responseHandler_1 = require("../utils/responseHandler");
const createCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            return (0, responseHandler_1.sendErrorResponse)(res, 401, "Category name is required");
        }
        const existCategory = yield category_1.default.findOne({ name });
        if (existCategory) {
            return (0, responseHandler_1.sendErrorResponse)(res, 409, `${name} already exists`);
        }
        const category = yield new category_1.default({ name, slug: (0, slugify_1.default)(name) }).save();
        return res.status(201).send({
            success: true,
            message: `${name} category created successfully`,
            category,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in creating category");
    }
});
exports.createCategoryController = createCategoryController;
const deleteCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield category_1.default.findByIdAndDelete(id);
        if (!category) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Category not found");
        }
        return res.status(200).send({
            success: true,
            message: `${category.name} deleted successfully`,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in deleting category");
    }
});
exports.deleteCategoryController = deleteCategoryController;
const updateCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return (0, responseHandler_1.sendErrorResponse)(res, 401, "Category name is required");
        }
        const updatedCategory = yield category_1.default.findByIdAndUpdate(id, { name, slug: (0, slugify_1.default)(name) }, { new: true });
        if (!updatedCategory) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Category not found");
        }
        return res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in updating category");
    }
});
exports.updateCategoryController = updateCategoryController;
const getCategoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield category_1.default.findById(id);
        if (!category) {
            return (0, responseHandler_1.sendErrorResponse)(res, 404, "Category not found");
        }
        return res.status(200).send({
            success: true,
            message: "Category fetched successfully",
            category,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in fetching category");
    }
});
exports.getCategoryController = getCategoryController;
const getAllCategoriesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.default.find()
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "Categories fetched successfully",
            categories,
        });
    }
    catch (error) {
        return (0, responseHandler_1.sendErrorResponse)(res, 500, "Error in fetching categories");
    }
});
exports.getAllCategoriesController = getAllCategoriesController;
