-- Allow deleting an EvaluationCycle to cascade-delete its Evaluations (and,
-- transitively, their Answers/Calibrations/room memberships).
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_cycleId_fkey";
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "EvaluationCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
