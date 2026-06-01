-- CreateTable
CREATE TABLE "AIModelConfig" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'paid',
    "baseUrl" TEXT,
    "apiKeyEnv" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIModelConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIModelConfig_enabled_idx" ON "AIModelConfig"("enabled");
