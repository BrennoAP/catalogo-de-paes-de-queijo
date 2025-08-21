import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPadaria = async (req, res) => {
  const { name, endereco } = req.body;
  try {
    const novaPadaria = await prisma.padaria.create({
      data: { 
        name,
        endereco
      },
    });
    res.status(201).json(novaPadaria); // retorna JSON pra atualizar o select no front
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};