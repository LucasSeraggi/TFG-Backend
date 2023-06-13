import express from "express";
import { verifyToken } from "../middlewares/auth";
import newsController from "../controllers/news.controller";

const router = express.Router();

router.get("/api/news", [verifyToken], newsController.find);

router.post("/api/news/register", [verifyToken], newsController.register);

router.patch("/api/news/update", [verifyToken], newsController.update);

router.delete("/api/news/delete", [verifyToken], newsController.remove);

export = router;
