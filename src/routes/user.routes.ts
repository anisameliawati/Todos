import { Router } from "express";
import { userController } from "../controller/user.controller";
const router = Router();

router.post("/v2", userController.register);
router.get("/v1", userController.login);
router.get("/v3", userController.keepLogin);
export default router;
