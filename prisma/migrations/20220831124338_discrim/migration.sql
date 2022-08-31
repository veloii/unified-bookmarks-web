/*
  Warnings:

  - A unique constraint covering the columns `[name,discrim]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Team_name_key";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "discrim" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_discrim_key" ON "Team"("name", "discrim");
