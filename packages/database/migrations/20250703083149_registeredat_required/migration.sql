/*
  Warnings:

  - Made the column `registeredAt` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "registeredAt" SET NOT NULL,
ALTER COLUMN "registeredAt" SET DEFAULT CURRENT_TIMESTAMP;
