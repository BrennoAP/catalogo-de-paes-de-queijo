import { Router } from "express";
import {  createPao, renderFormNovoPao ,renderHome,listAllPaes,softDeletePao,renderEditPao,updatePao,renderPaoSuccess  } from "../controllers/paesController.js";
import { uploadSingleImage } from "../middleware/upload.js";
import { isAdmin,isLoggedIn } from "../middleware/authMiddleware.js";


const router = Router();

router.get("/", renderHome);
router.get("/listall", listAllPaes);

router.post("/create",isLoggedIn,isAdmin,uploadSingleImage("foto"), createPao);
router.get("/novo",isLoggedIn, isAdmin, renderFormNovoPao);

router.post("/pao/delete/:id", isLoggedIn, isAdmin,softDeletePao);

router.get("/edit/:id",isLoggedIn, isAdmin, renderEditPao);

router.post("/edit/:id", isLoggedIn, isAdmin, updatePao);
router.get("/success", isLoggedIn, isAdmin, renderPaoSuccess);


export default router;