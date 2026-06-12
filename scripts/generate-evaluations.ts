/**
 * Generates Evaluation records for all RUNNING cycles that have no evaluations yet.
 * Run: node --experimental-strip-types scripts/generate-evaluations.ts
 */
import { PrismaClient, EvaluationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const TENANT_ID = 'f154e4b9-7805-4bd1-b0b1-43ba1c850357';

  const runningCycles = await prisma.evaluationCycle.findMany({
    where: { tenantId: TENANT_ID, status: 'RUNNING' },
    select: { id: true, name: true, target: true },
  });

  if (runningCycles.length === 0) {
    console.log('Nenhum ciclo RUNNING encontrado.');
    return;
  }

  for (const cycle of runningCycles) {
    console.log(`\nCiclo: ${cycle.name} (${cycle.id})`);

    const employees = await prisma.user.findMany({
      where: {
        tenantId: TENANT_ID,
        role: { not: 'ADMIN' },
        ...(cycle.target === 'MANAGERS' ? { isManager: true } : {}),
      },
      select: { id: true, name: true, managerId: true },
    });

    const existing = await prisma.evaluation.findMany({
      where: { cycleId: cycle.id, tenantId: TENANT_ID },
      select: { employeeId: true },
    });
    const existingIds = new Set(existing.map((e) => e.employeeId));

    const toCreate = employees.filter((e) => !existingIds.has(e.id) && e.managerId !== null);

    if (toCreate.length === 0) {
      console.log('  Todas as avaliações já existem.');
      continue;
    }

    for (const e of toCreate) {
      await prisma.evaluation.create({
        data: {
          cycleId: cycle.id,
          tenantId: TENANT_ID,
          employeeId: e.id,
          managerId: e.managerId!,
          status: EvaluationStatus.PENDING_SELF_REVIEW,
        },
      });
      console.log(`  Criado: ${e.name}`);
    }
    console.log(`  Total criado: ${toCreate.length}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
