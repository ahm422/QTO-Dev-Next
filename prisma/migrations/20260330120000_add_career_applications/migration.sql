-- CreateTable
CREATE TABLE "career_applications" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role_interest" TEXT,
    "message" TEXT NOT NULL,
    "portfolio_url" TEXT,
    "linkedin_url" TEXT,
    "github_url" TEXT,
    "source" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,
    "ip" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "career_applications_email_idx" ON "career_applications"("email");

-- CreateIndex
CREATE INDEX "career_applications_created_at_idx" ON "career_applications"("created_at");

