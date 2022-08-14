-- CreateTable
CREATE TABLE "_bannedTeams" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_bannedTeams_AB_unique" ON "_bannedTeams"("A", "B");

-- CreateIndex
CREATE INDEX "_bannedTeams_B_index" ON "_bannedTeams"("B");

-- AddForeignKey
ALTER TABLE "_bannedTeams" ADD CONSTRAINT "_bannedTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bannedTeams" ADD CONSTRAINT "_bannedTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
