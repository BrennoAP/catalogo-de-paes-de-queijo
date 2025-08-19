import { Router } from "express";
import {  createPao, renderPaes } from "../controllers/paesController.js";

const router = Router();

router.get("/", renderPaes);
router.post("/", createPao);


export default router;