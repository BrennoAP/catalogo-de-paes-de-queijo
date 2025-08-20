import { Router } from "express";
import {  createPao, renderPaes, renderFormNovoPao } from "../controllers/paesController.js";
import { uploadSingleImage } from "../middleware/upload.js";

const router = Router();

router.get("/", renderPaes);
router.post("/create",uploadSingleImage("foto"), createPao);
router.get("/novo", renderFormNovoPao);


export default router;