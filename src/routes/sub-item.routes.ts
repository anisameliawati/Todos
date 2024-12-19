import { Router } from "express";
import { verifyUser } from "../middleware/auth-middleware";
import { subItemController } from "../controller/sub-item.controller";

const router = Router();

router.post("/sub", verifyUser, subItemController.createSubItem);
router.get("/sub", verifyUser, subItemController.getSubItems);
router.get("/sub/:id", verifyUser, subItemController.getSubItemDetail);
router.put("/sub/:id", verifyUser, subItemController.editSubItem);
router.delete("/sub/:id", verifyUser, subItemController.deleteSubItem);

export default router;
