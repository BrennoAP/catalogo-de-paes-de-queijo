import { Router } from "express";

const router = Router();

// Sobre
router.get("/sobre", (req, res) => {
  res.render("sobre", { title: "Sobre - Catálogo de Pães" });
});

//Contato
router.get("/contato", (req, res) => {
  res.render("contato", { title: "Contato - Catálogo de Pães" });
});



export default router;