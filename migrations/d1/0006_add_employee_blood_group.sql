-- AlterTable: add nullable blood_group to employees (shown on the ID badge)
ALTER TABLE "employees" ADD COLUMN "blood_group" TEXT;
