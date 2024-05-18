/*
  Warnings:

  - Added the required column `description` to the `Jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Jobs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `state` on the `Jobs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "JobState" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'FINISHED');

-- AlterTable
ALTER TABLE "Jobs" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "state",
ADD COLUMN     "state" "JobState" NOT NULL;
