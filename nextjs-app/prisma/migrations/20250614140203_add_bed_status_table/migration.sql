-- CreateTable
CREATE TABLE "bed_status" (
    "id" SERIAL NOT NULL,
    "bedId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "bed_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bed_status" ADD CONSTRAINT "bed_status_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "beds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
