
import { Router } from 'express';
import { verifyJwt } from '../Middlewares/verifyJwt';
import { createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController } from '../controllers/categoryController';

const router = Router();

router.post("/create",verifyJwt,createCategoryController)
router.put("/update/:id",verifyJwt,updateCategoryController)
router.get("/all",getAllCategoriesController)
router.delete("/delete/:id",verifyJwt,deleteCategoryController);
router.get("/categoryById/:cid",getCategoryByIdController)
export default router;