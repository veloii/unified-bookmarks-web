/*
  Warnings:

  - A unique constraint covering the columns `[name,teamId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[link,teamId]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_name_teamId_key" ON "Bookmark"("name", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_link_teamId_key" ON "Bookmark"("link", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
