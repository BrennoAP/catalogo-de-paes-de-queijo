import { Router } from "express";
import { createPadaria } from "../controllers/padariaController.js";

const router = Router();

router.post("/padarias", createPadaria);

export default router;