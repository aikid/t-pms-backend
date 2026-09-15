import { PrismaClient, EvaluationStatus, AnswerType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const evaluations = await prisma.evaluation.findMany({
    where: {
      status: { in: [EvaluationStatus.PENDING_SELF_REVIEW, EvaluationStatus.PENDING_MANAGER_REVIEW] },
    },
    include: { answers: true },
  });

  let fixed = 0;
  for (const ev of evaluations) {
    const selfCount = ev.answers.filter((a) => a.type === AnswerType.SELF).length;
    const managerCount = ev.answers.filter((a) => a.type === AnswerType.MANAGER).length;

    let nextStatus = ev.status;
    if (selfCount > 0 && managerCount > 0) {
      nextStatus = EvaluationStatus.AWAITING_CALIBRATION;
    } else if (selfCount > 0) {
      nextStatus = EvaluationStatus.PENDING_MANAGER_REVIEW;
    } else {
      nextStatus = EvaluationStatus.PENDING_SELF_REVIEW;
    }

    if (nextStatus !== ev.status) {
      await prisma.evaluation.update({ where: { id: ev.id }, data: { status: nextStatus } });
      console.log(`Evaluation ${ev.id}: ${ev.status} -> ${nextStatus}`);
      fixed++;
    }
  }

  console.log(`Done. ${fixed} evaluation(s) fixed out of ${evaluations.length} checked.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
