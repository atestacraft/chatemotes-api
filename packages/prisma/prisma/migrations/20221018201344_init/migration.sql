-- CreateTable
CREATE TABLE "Emote" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "file" BYTEA NOT NULL,
    "emojiId" INTEGER NOT NULL,

    CONSTRAINT "Emote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emoji" (
    "id" SERIAL NOT NULL,
    "char" TEXT NOT NULL,

    CONSTRAINT "Emoji_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Emote_name_key" ON "Emote"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Emote_emojiId_key" ON "Emote"("emojiId");

-- AddForeignKey
ALTER TABLE "Emote" ADD CONSTRAINT "Emote_emojiId_fkey" FOREIGN KEY ("emojiId") REFERENCES "Emoji"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
