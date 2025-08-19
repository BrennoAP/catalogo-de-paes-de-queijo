import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function teste() {
  const users = await prisma.user.findMany();
  console.log("Users:", users);
}

teste()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());



  //testando se a conn funciona
  //tem que rodar com node prisma/test.js e retornar um array vazio