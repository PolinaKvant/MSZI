import FavoriteController from "@/controllers/favoriteController";
import authMiddleware from "@/middlewares/authMiddleware";
import { Router } from "express";

const router = Router();

//@ts-ignore
router.get("/", authMiddleware, FavoriteController.getFavorites);
//@ts-ignore
router.post("/", authMiddleware, FavoriteController.addFavorite);
//@ts-ignore
router.delete("/", authMiddleware, FavoriteController.deleteFavorite);

export default router;
