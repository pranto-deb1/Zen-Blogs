/*
  Warnings:

  - The values [APROVED] on the enum `CommentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CANCLED] on the enum `SubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CommentStatus_new" AS ENUM ('APPROVED', 'REJECTED');
ALTER TABLE "public"."comments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "comments" ALTER COLUMN "status" TYPE "CommentStatus_new" USING ("status"::text::"CommentStatus_new");
ALTER TYPE "CommentStatus" RENAME TO "CommentStatus_old";
ALTER TYPE "CommentStatus_new" RENAME TO "CommentStatus";
DROP TYPE "public"."CommentStatus_old";
ALTER TABLE "comments" ALTER COLUMN "status" SET DEFAULT 'APPROVED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionStatus_new" AS ENUM ('ACTIVE', 'CANCELED', 'EXPIRED');
ALTER TABLE "public"."subscription" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "subscription" ALTER COLUMN "status" TYPE "SubscriptionStatus_new" USING ("status"::text::"SubscriptionStatus_new");
ALTER TYPE "SubscriptionStatus" RENAME TO "SubscriptionStatus_old";
ALTER TYPE "SubscriptionStatus_new" RENAME TO "SubscriptionStatus";
DROP TYPE "public"."SubscriptionStatus_old";
ALTER TABLE "subscription" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "status" SET DEFAULT 'APPROVED';
