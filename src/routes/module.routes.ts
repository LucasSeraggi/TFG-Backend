import express from "express";
import { verifyToken } from "../middlewares/auth";
import moduleController from "../controllers/module.controller";

const router = express.Router();

router.get("/api/module", [verifyToken], moduleController.find);

router.post("/api/module/register", [verifyToken], moduleController.register);

router.delete("/api/module/delete", [verifyToken], moduleController.remove);

router.patch("/api/module/update", [verifyToken], moduleController.update);

export = router;
