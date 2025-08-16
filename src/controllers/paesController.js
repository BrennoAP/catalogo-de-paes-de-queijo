import { json } from "express";
import { paes, padarias } from "../models/bd-mock.js";

export const getPaes = (req, res) => {
  res.status(200).json(paes);
};
