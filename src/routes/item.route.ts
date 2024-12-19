import { Router } from "express";
import { verifyUser } from "../middleware/auth-middleware";
import { itemcontroller } from "../controller/item-todo.controller";

const router = Router();

router.post("/item", verifyUser, itemcontroller.createItem);
router.get("/item", verifyUser, itemcontroller.getItems);
router.get("/item/:id", verifyUser, itemcontroller.getItemDetail);
router.put("/item/:id", verifyUser, itemcontroller.editItem);
router.delete("/item/:id", verifyUser, itemcontroller.deleteItem);

export default router;
