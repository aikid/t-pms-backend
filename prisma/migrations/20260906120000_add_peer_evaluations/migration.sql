-- AlterEnum
ALTER TYPE "QuestionRespondent" ADD VALUE 'PEER';

-- CreateEnum
CREATE TYPE "PeerEvaluationStatus" AS ENUM ('PENDING', 'SUBMITTED');

-- CreateTable
CREATE TABLE "PeerEvaluation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "evaluatorId" TEXT NOT NULL,
    "evaluateeId" TEXT NOT NULL,
    "status" "PeerEvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeerEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeerAnswer" (
    "id" TEXT NOT NULL,
    "peerEvaluationId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "textAnswer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeerAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PeerEvaluation_cycleId_evaluatorId_evaluateeId_key" ON "PeerEvaluation"("cycleId", "evaluatorId", "evaluateeId");

-- CreateIndex
CREATE UNIQUE INDEX "PeerAnswer_peerEvaluationId_questionId_key" ON "PeerAnswer"("peerEvaluationId", "questionId");

-- AddForeignKey
ALTER TABLE "PeerEvaluation" ADD CONSTRAINT "PeerEvaluation_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "EvaluationCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerEvaluation" ADD CONSTRAINT "PeerEvaluation_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerEvaluation" ADD CONSTRAINT "PeerEvaluation_evaluateeId_fkey" FOREIGN KEY ("evaluateeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerAnswer" ADD CONSTRAINT "PeerAnswer_peerEvaluationId_fkey" FOREIGN KEY ("peerEvaluationId") REFERENCES "PeerEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeerAnswer" ADD CONSTRAINT "PeerAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
