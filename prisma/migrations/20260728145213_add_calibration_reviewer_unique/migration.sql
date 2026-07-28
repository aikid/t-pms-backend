/*
  Warnings:

  - A unique constraint covering the columns `[evaluationId,reviewerId]` on the table `Calibration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Calibration_evaluationId_reviewerId_key" ON "Calibration"("evaluationId", "reviewerId");
