
import { Router } from 'express';
import { verifyJwt } from '../Middlewares/verifyJwt';
import { AddProductByExcel, createProductController, deleteProductController, filterProductsController, getAllProductsController, getProductByIdController, getProductByNameController, updateProductController } from '../controllers/productController';
import { uploadMiddleware } from '../Middlewares/uploadMiddleware';

const router = Router();

router.post("/add",verifyJwt,createProductController)
router.put("/update/:id",verifyJwt,updateProductController)
router.delete("/delete/:id",verifyJwt,deleteProductController)
router.post("/upload-excel",verifyJwt,uploadMiddleware,AddProductByExcel)
router.get("/getbyid/:id",getProductByIdController)
router.get("/get",getAllProductsController)
router.get("/getbyname/:name",getProductByNameController)
router.get("/filter",filterProductsController)
export default router;