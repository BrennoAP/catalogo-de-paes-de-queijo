//criei um seed simples, sem usar faker e tal

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  //deleta os trem antes de popular
  await prisma.pao.deleteMany();
  await prisma.padaria.deleteMany();
  await prisma.user.deleteMany();

  //padarias
  const padaria1 = await prisma.padaria.create({
    data: { name: "Padaria do morro", endereco: "Rua peculiar, 123" },
  });

  const padaria2 = await prisma.padaria.create({
    data: { name: "Padaria do centro", endereco: "Av. central, 456" },
  });

  //pães
  await prisma.pao.createMany({
    data: [
      {
        name: "Pão de Queijo",
        preco: 5.5,
        textura: "macio",
        padariaId: padaria1.id,
      },
      {
        name: "Pão de Sal",
        preco: 4.0,
        textura: "crocante",
        padariaId: padaria1.id,
      },
      {
        name: "Pão de Queijo",
        preco: 6.0,
        textura: "macio",
        padariaId: padaria2.id,
      },
      {
        name: "Pão de sal",
        preco: 2.5,
        textura: "duro",
        padariaId: padaria2.id,
      },
    ],
  });

  //usuário de teste
  //   await prisma.user.create({
  //     data: { name: "Admin", email: "admin@padaria.com", password: "123456" },
  //   });

  console.log("Seeding finalziado!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  //executa com node prisma/seed.js ou roda pelo script