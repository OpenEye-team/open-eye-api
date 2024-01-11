/*
  Warnings:

  - Added the required column `userId` to the `report_glucometer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "report_glucometer" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "report_glucometer" ADD CONSTRAINT "report_glucometer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
