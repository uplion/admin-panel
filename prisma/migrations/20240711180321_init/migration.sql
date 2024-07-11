-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('LOCAL', 'REMOTE');

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isQuotaLimited" BOOLEAN NOT NULL,
    "remainingTokens" INTEGER,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "allowedModels" TEXT[],

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIModel" (
    "id" SERIAL NOT NULL,
    "type" "ModelType" NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT,
    "apiToken" TEXT,

    CONSTRAINT "AIModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApiKey_key_idx" ON "ApiKey"("key");

-- CreateIndex
CREATE INDEX "AIModel_name_idx" ON "AIModel"("name");
