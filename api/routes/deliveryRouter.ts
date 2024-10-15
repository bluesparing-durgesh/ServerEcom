import { Router } from "express";
import { verifyJwt } from "../Middlewares/verifyJwt";
import {
  getdeliveryByOrderIdController,
  updateCanceledDeliveryController,
  updateDeliveryController,
} from "../controllers/DeliveryController";

const router = Router();

router.put("/update/:orderId", verifyJwt, updateDeliveryController);
router.put(
  "/update-cancel/:orderId",
  verifyJwt,
  updateCanceledDeliveryController
);
router.get("/get/:orderId", verifyJwt, getdeliveryByOrderIdController);
export default router;
