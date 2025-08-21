import { Router } from "express";
import {  createPao, renderFormNovoPao ,renderHome,listAllPaes  } from "../controllers/paesController.js";
import { uploadSingleImage } from "../middleware/upload.js";

const router = Router();

router.get("/", renderHome);
router.get("/listall", listAllPaes);
//router.get("/", renderPaes);
router.post("/create",uploadSingleImage("foto"), createPao);
router.get("/novo", renderFormNovoPao);


export default router;