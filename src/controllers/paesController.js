
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const renderPaes = async (req, res) => {
  try {
    const paes = await prisma.pao.findMany({ include: { padaria: true } });
    res.render("index", { paes }); //
  } catch (err) {
    res.status(500).send("Erro ao carregar pães");
  }
};


export const createPao = async (req, res) => {
  const { name, preco, textura, padariaId } = req.body;
  try {
    const novoPao = await prisma.pao.create({
      data: { name, preco: parseFloat(preco), textura, padariaId: Number(padariaId) },
    });
    res.status(201).json(novoPao);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};