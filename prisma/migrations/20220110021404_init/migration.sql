/*
  Warnings:

  - You are about to drop the `Frens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Frens";

-- CreateTable
CREATE TABLE "Fren" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ens" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "twitterPicture" TEXT,
    "ensAvatar" TEXT,
    "tweeted" BOOLEAN,

    PRIMARY KEY ("id")
);
