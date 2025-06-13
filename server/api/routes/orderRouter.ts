import { Router } from "express";
import { verifyJwt } from "../Middlewares/verifyJwt";
import {
  createOrderController,
  getAllOrderController,
  getOrderByOrderIdController,
  getUserOrderController,
  refundOrderController,
  updateCODProductController,
} from "../controllers/orderController";
const router = Router();

router.post("/add", verifyJwt, createOrderController);
router.get("/get", verifyJwt, getUserOrderController);
router.get("/get-all", verifyJwt, getAllOrderController);
router.put("/refund", verifyJwt, refundOrderController);
router.put("/update-payment", verifyJwt, updateCODProductController);
router.get("/get-byId/:id", verifyJwt, getOrderByOrderIdController);
export default router;
