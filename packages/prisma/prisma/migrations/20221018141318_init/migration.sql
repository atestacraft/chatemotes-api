-- CreateTable
CREATE TABLE "Emote" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Emote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Emote_name_key" ON "Emote"("name");
