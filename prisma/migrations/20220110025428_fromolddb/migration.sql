/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Fren` table. All the data in the column will be lost.
  - You are about to drop the column `ensAvatar` on the `Fren` table. All the data in the column will be lost.
  - You are about to drop the column `twitterPicture` on the `Fren` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Fren" DROP COLUMN "createdAt",
DROP COLUMN "ensAvatar",
DROP COLUMN "twitterPicture",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ens_avatar" TEXT,
ADD COLUMN     "twitter_pfp" TEXT;
