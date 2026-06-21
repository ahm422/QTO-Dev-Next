-- AlterTable
ALTER TABLE "about_content" ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "page_sections" (
    "slug" TEXT NOT NULL,
    "label" TEXT,
    "data" JSONB NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_sections_pkey" PRIMARY KEY ("slug")
);
