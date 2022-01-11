/*
  Warnings:

  - You are about to drop the column `textSearch` on the `Fren` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Fren.textSearch_index";

-- AlterTable
ALTER TABLE "Fren" DROP COLUMN "textSearch";
