-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('local', 'remote');

-- CreateTable
CREATE TABLE "Token" (
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

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiModel" (
    "id" SERIAL NOT NULL,
    "type" "ModelType" NOT NULL,
    "name" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "baseUrl" TEXT,
    "apiToken" TEXT,

    CONSTRAINT "AiModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Token_key_idx" ON "Token"("key");

-- CreateIndex
CREATE INDEX "AiModel_name_idx" ON "AiModel"("name");
