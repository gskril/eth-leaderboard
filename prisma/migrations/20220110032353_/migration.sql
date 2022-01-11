/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Fren` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Fren.id_unique" ON "Fren"("id");

-- CreateIndex
CREATE INDEX "rank" ON "Fren"("followers");
