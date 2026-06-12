-- CreateEnum
CREATE TYPE "QuestionRespondent" AS ENUM ('EMPLOYEE', 'MANAGER', 'BOTH');

-- AlterTable
ALTER TABLE "EvaluationCycle" ADD COLUMN     "endCalibrationDate" TIMESTAMP(3),
ADD COLUMN     "endManagerDate" TIMESTAMP(3),
ADD COLUMN     "startCalibrationDate" TIMESTAMP(3),
ADD COLUMN     "startManagerDate" TIMESTAMP(3),
ALTER COLUMN "managerAditionalDays" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "respondent" "QuestionRespondent" NOT NULL DEFAULT 'BOTH';
