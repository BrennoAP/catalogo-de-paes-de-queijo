import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const loginForm = (req, res) => {
  res.render("login"); // cria uma view login.ejs
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).send("Credenciais incorretas");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).send("Credenciais incorretas");

    req.session.user = {
    id: user.id,
    email: user.email,
    role: user.role
    };
req.session.save(err => {
  if (err) return console.error(err);
  res.redirect("/");
});
};

export const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error("Erro ao destruir sessão:", err);
    res.redirect("/");
  });
};
