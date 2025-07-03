/*
  Warnings:

  - You are about to drop the column `recordedAt` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "recordedAt",
ADD COLUMN     "registeredAt" TIMESTAMP(3);
