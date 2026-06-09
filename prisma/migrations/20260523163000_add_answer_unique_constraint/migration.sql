-- CreateIndex
CREATE UNIQUE INDEX "Answer_evaluationId_questionId_type_key" ON "Answer"("evaluationId", "questionId", "type");
