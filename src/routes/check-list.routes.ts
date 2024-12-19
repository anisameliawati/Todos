import { Router } from "express";
import { checklistController } from "../controller/check-list.controller";
import { verifyUser } from "../middleware/auth-middleware";

const router = Router();

router.post("/checklist", verifyUser, checklistController.createCheckList);
router.get("/checklist", verifyUser, checklistController.getCheckList);
router.get(
  "/checklist/:id",
  verifyUser,
  checklistController.getCheckListDetail
);
router.put("/checklist/:id", verifyUser, checklistController.editChecklist);
router.delete(
  "/checklist/:id",
  verifyUser,
  checklistController.deleteChecklist
);

export default router;
