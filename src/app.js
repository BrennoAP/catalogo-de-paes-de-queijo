import express from "express";
import homeRoute from "./routes/home.js"

const app = express();

app.use(express.json())

app.use("/",homeRoute)


export default  app


