import { refreshAccessToken } from './../controllers/userController';
import { Router } from 'express';
import { login, register } from '../controllers/userController';
const router = Router();

router.post("/register",register)
router.post("/login",login)
router.put("/refreshAccessToken",refreshAccessToken)
export default router;