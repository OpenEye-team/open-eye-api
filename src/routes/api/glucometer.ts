import { Router } from "express";
import { create, get, destroy  } from '../../controllers/glucometer.controller';
import { requireUser } from "../../middleware/requireUser";
const router = Router();

router.post("/", requireUser, create)
router.get("/", requireUser, get)
router.delete("/:id", requireUser, destroy)
export default router;