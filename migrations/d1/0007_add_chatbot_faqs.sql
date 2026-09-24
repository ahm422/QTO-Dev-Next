-- CreateTable: general FAQs managed from the admin panel and fed only to the
-- chatbot worker's RAG knowledge base (not rendered on the public site).
CREATE TABLE "chatbot_faqs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "chatbot_faqs_category_idx" ON "chatbot_faqs"("category");

-- CreateIndex
CREATE INDEX "chatbot_faqs_order_idx" ON "chatbot_faqs"("order");
