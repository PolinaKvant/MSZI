import AuthController from "@/controllers/authController";
import authMiddleware from "@/middlewares/authMiddleware";
import { Router } from "express";

const router = Router();

//@ts-ignore
router.post("/login", AuthController.login);
//@ts-ignore
router.post("/register", AuthController.register);
//@ts-ignore
router.get("/refresh", AuthController.refresh);
//@ts-ignore
router.get("/logout", AuthController.logout);
//@ts-ignore
router.get("/me", authMiddleware, AuthController.me);

export default router;
