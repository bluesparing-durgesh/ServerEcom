import { Router } from "express";
import { verifyJwt } from "../Middlewares/verifyJwt";
import { createOrderController, getUserOrder } from "../controllers/orderController";
const router = Router();

router.post("/add",verifyJwt,createOrderController)
router.get("/get",verifyJwt,getUserOrder);
export default router;