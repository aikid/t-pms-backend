-- CreateTable
CREATE TABLE "CalibrationRoom" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalibrationRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalibrationRoomEvaluation" (
    "roomId" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,

    CONSTRAINT "CalibrationRoomEvaluation_pkey" PRIMARY KEY ("roomId","evaluationId")
);

-- CreateTable
CREATE TABLE "CalibrationRoomParticipant" (
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'REVIEWER',

    CONSTRAINT "CalibrationRoomParticipant_pkey" PRIMARY KEY ("roomId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalibrationRoom_cycleId_name_key" ON "CalibrationRoom"("cycleId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CalibrationRoomEvaluation_evaluationId_key" ON "CalibrationRoomEvaluation"("evaluationId");

-- AddForeignKey
ALTER TABLE "CalibrationRoom" ADD CONSTRAINT "CalibrationRoom_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "EvaluationCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalibrationRoomEvaluation" ADD CONSTRAINT "CalibrationRoomEvaluation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "CalibrationRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalibrationRoomEvaluation" ADD CONSTRAINT "CalibrationRoomEvaluation_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalibrationRoomParticipant" ADD CONSTRAINT "CalibrationRoomParticipant_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "CalibrationRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalibrationRoomParticipant" ADD CONSTRAINT "CalibrationRoomParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
