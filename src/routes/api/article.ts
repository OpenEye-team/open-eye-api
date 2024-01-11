import { Router } from "express";
import { upload } from '../../utils';
import { create, update, get, destroy, uploadThumbnail, getById } from '../../controllers/article.controller';
import { requireUser } from "../../middleware/requireUser";
const router = Router();

router.post("/", requireUser, create)
router.post("/upload", requireUser, upload.single('image'), uploadThumbnail)
router.get("/", requireUser, get)
router.get("/:id", requireUser, getById)
router.delete("/:id", requireUser, destroy)
router.put("/:id", requireUser, update)
export default router;