-- CreateTable
CREATE TABLE "CalibrationConfig" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "model" TEXT NOT NULL DEFAULT 'HYBRID',
    "calibrableField" TEXT NOT NULL DEFAULT 'PERFORMANCE',
    "roomFormation" TEXT NOT NULL DEFAULT 'RULE',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalibrationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalibrationConfig_cycleId_key" ON "CalibrationConfig"("cycleId");

-- AddForeignKey
ALTER TABLE "CalibrationConfig" ADD CONSTRAINT "CalibrationConfig_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "EvaluationCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
