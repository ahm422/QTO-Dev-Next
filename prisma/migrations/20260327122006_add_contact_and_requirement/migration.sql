-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "source" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,
    "ip" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requirements" (
    "id" UUID NOT NULL,
    "intent" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "website" TEXT,
    "role" TEXT,
    "project_type" TEXT,
    "industry" TEXT,
    "company_size" TEXT,
    "goals" TEXT,
    "budget_range" TEXT,
    "start_date" TEXT,
    "launch_window" TEXT,
    "urgency" TEXT,
    "timeline" TEXT,
    "preferred_time" TEXT,
    "timezone" TEXT,
    "channel" TEXT,
    "features" TEXT,
    "integrations" TEXT,
    "success_criteria" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,
    "ip" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requirements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contacts_email_idx" ON "contacts"("email");

-- CreateIndex
CREATE INDEX "contacts_created_at_idx" ON "contacts"("created_at");

-- CreateIndex
CREATE INDEX "requirements_intent_idx" ON "requirements"("intent");

-- CreateIndex
CREATE INDEX "requirements_email_idx" ON "requirements"("email");

-- CreateIndex
CREATE INDEX "requirements_created_at_idx" ON "requirements"("created_at");
