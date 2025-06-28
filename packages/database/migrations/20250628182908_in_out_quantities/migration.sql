/*
  Warnings:

  - You are about to drop the column `quantity` on the `ReportItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReportItem" DROP COLUMN "quantity",
ADD COLUMN     "inQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "outQuantity" DOUBLE PRECISION NOT NULL DEFAULT 0;
