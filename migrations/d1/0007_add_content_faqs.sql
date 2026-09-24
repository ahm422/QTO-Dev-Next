-- CreateTable
CREATE TABLE "service_faqs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "service_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "service_faqs_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blog_post_faqs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blog_post_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "blog_post_faqs_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "blog_posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "service_faqs_service_id_idx" ON "service_faqs"("service_id");

-- CreateIndex
CREATE INDEX "blog_post_faqs_blog_post_id_idx" ON "blog_post_faqs"("blog_post_id");
