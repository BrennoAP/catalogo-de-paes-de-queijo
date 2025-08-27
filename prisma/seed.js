import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  
  await prisma.pao.deleteMany({});
  await prisma.padaria.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Deletados os dados antigos");

  const adminPassword = process.env.ADMIN_PASSWORD
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@pao.com",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log("Usuário admin criado");


  //em produção apenas o user admin vai ser inserido atraves de seed

  const padariasData = [
    { name: "Padaria Central", endereco: "Rua Principal, 123" },
    { name: "Pão Doido", endereco: "Av. doida, 456" },
  ];

  const padariaRecords = [];
  for (const p of padariasData) {
    const padaria = await prisma.padaria.create({ data: p });
    padariaRecords.push(padaria);
  }
  console.log("Padarias criadas");


  const paesData = [
    { name: "Pão de queijo", descricao: "Crocrante por fora e macio por dentro", preco: 1.5, textura: "Crocante" },
    { name: "Pão de Forma", descricao: "Para sanduíches", preco: 3.0, textura: "Macio" },
    { name: "Pão Integral", descricao: "Mais saudável", preco: 4.0, textura: "Macio" },
  ];

  for (const padaria of padariaRecords) {
    for (const pao of paesData) {
      await prisma.pao.create({
        data: {
          ...pao,
          padariaId: padaria.id,
        },
      });
    }
  }

  console.log("Pães criados");
}

main()
  .then(() => {
    console.log("Seed finalizado!");
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
