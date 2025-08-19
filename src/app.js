import express from "express";
import helmet from "helmet"; //adiciona headers de segurança 
import path from "path";
import { fileURLToPath } from "url";
import paoRoutes from "./routes/paoRoutes.js";
import pageRoutes from "./routes/pageRoutes.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//pequeno lembrete que o helmet e outros parsers vem ANTES da rota...
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//fazendo os ajustes pro ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//eu achei engraçado o nome "paoRoutes" dai deixei kkk
app.use("/", paoRoutes);
app.use("/", pageRoutes)


export default app;
