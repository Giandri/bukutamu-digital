-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "qrCode" TEXT,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceptionLog" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReceptionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_qrCode_key" ON "Guest"("qrCode");

-- CreateIndex
CREATE INDEX "ReceptionLog_guestId_idx" ON "ReceptionLog"("guestId");

-- AddForeignKey
ALTER TABLE "ReceptionLog" ADD CONSTRAINT "ReceptionLog_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
