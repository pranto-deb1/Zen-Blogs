/*
  Warnings:

  - You are about to drop the column `customerId` on the `subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentPeriodStart` to the `subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeCustomerId` to the `subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSubscriptionId` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "subscription_customerId_key";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "customerId",
ADD COLUMN     "currentPeriodStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stripeCustomerId" TEXT NOT NULL,
ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripeSubscriptionId_key" ON "subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_stripeCustomerId_key" ON "subscription"("stripeCustomerId");
