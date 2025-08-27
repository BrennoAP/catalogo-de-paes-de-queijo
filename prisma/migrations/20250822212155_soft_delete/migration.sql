/*
  Warnings:

  - A unique constraint covering the columns `[name,padariaId]` on the table `Pao` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Padaria" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Pao" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Pao_name_padariaId_key" ON "Pao"("name", "padariaId");
