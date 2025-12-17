-- CreateTable
CREATE TABLE "Recipient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "whatsapp" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipient_name_key" ON "Recipient"("name");
