import { getAllUserController, refreshAccessToken } from './../controllers/userController';
import { Router } from 'express';
import { login, register } from '../controllers/userController';
import { verifyJwt } from '../Middlewares/verifyJwt';
import { getDashboardStats } from '../controllers/adminDashboard';
const router = Router();

router.post("/register",register)
router.post("/login",login)
router.put("/refreshAccessToken",refreshAccessToken)
router.get("/get-all",verifyJwt,getAllUserController)
router.get("/dashboard",verifyJwt,getDashboardStats)
export default router;