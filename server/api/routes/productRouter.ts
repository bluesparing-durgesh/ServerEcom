import { searchProductSuggestionsController } from './../controllers/productController';

import { Router } from 'express';
import { verifyJwt } from '../Middlewares/verifyJwt';
import { AddProductByExcel, createProductController, deleteProductController, filterProductsController, getAllProductOnceController, getAllProductsController, getProductByIdController, getProductByNameController, updateProductController, updateRatingController } from '../controllers/productController';
import { uploadMiddleware } from '../Middlewares/uploadMiddleware';

const router = Router();

router.post("/add",verifyJwt,createProductController);
router.put("/update/:id",verifyJwt,updateProductController);
router.delete("/delete/:id",verifyJwt,deleteProductController);
router.post("/upload-excel",verifyJwt,uploadMiddleware,AddProductByExcel);
router.get("/getbyid/:id",getProductByIdController);
router.get("/get/:id?",getAllProductsController);
router.get("/getbyname/:name",getProductByNameController);
router.get("/filter",filterProductsController);
router.get("/get-all",verifyJwt,getAllProductOnceController);
router.get("/search-suggestions",searchProductSuggestionsController);
router.put("/update-rating",verifyJwt,updateRatingController);
export default router;