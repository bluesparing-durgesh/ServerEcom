import { Router } from "express";
import { verifyJwt } from "../Middlewares/verifyJwt";
import {
  checkexistReviewController,
  getReviewByProductIdController,
  getReviewByUserIdController,
} from "../controllers/reviewController";

const router = Router();

router.get("/get-by-product-id/:pId", getReviewByProductIdController);
router.get("/get-user-revirew/:user", verifyJwt, getReviewByUserIdController);
router.get("/check-exist/:product", verifyJwt, checkexistReviewController);

export default router;
