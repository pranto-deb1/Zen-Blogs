/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "customerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscription_customerId_key" ON "subscription"("customerId");
