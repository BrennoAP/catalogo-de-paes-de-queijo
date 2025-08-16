import { Router } from "express";
import { getPaes } from "../controllers/paesController.js";

const router = Router();

router.get("/", getPaes);

//router.get("/health", (req, res) => res.send("ok"));

export default router;
