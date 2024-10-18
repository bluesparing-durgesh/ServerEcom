import { Router } from "express";
import { verifyJwt } from "../Middlewares/verifyJwt";
import { createOrderController, getAllOrderController, getUserOrderController } from "../controllers/orderController";
const router = Router();

router.post("/add",verifyJwt,createOrderController)
router.get("/get",verifyJwt,getUserOrderController);
router.get("/get-all",verifyJwt,getAllOrderController)
export default router;