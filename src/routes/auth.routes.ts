import { Router } from "express";
import * as AuthController from "../controllers/auth.controllers";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/login", AuthController.login);
router.post("/google", AuthController.googleAuth);

export default router;
