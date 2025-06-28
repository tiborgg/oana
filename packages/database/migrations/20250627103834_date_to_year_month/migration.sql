/*
  Warnings:

  - You are about to drop the column `date` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `range` on the `Report` table. All the data in the column will be lost.
  - Added the required column `month` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "date",
DROP COLUMN "range",
ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "ReportRange";
