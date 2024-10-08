import { Router } from "express";
import { verifyJwt } from "../Middlewares/verifyJwt";
import {
  createCartEntry,
  deleteCartEntry,
  getUserCart,
  updateCartEntry,
} from "../controllers/CartController";

const router = Router();

router.post("/create", verifyJwt, createCartEntry);
router.put("/update/:cartId", verifyJwt, updateCartEntry);
router.get("/all", verifyJwt, getUserCart);
router.delete("/delete/:cartId", verifyJwt, deleteCartEntry);
export default router;
