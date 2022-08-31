/*
  Warnings:

  - A unique constraint covering the columns `[intId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "intId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_intId_key" ON "Team"("intId");
