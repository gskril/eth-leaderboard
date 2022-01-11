-- CreateTable
CREATE TABLE "Frens" (
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
