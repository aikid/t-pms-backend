import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { tenantContext } from 'src/shared/context/tenant.context';
import { CycleStatus, EvaluationStatus, QuestionCategory, QuestionRespondent, QuestionStatus, TargetCycle } from '@prisma/client';

export class CreateCycleDto {
  name: string;
  startDate: string;
  endDate: string;
  startEmployeeDate: string;
  endEmployeeDate: string;
  managerAditionalDays?: number;
  startManagerDate?: string;
  endManagerDate?: string;
  startCalibrationDate?: string;
  endCalibrationDate?: string;
  target: TargetCycle;
}

export class CreateQuestionDto {
  title: string;
  description?: string;
  category: QuestionCategory;
  respondent?: QuestionRespondent;
  weight: number;
  status?: QuestionStatus;
}

export class CreateScaleDto {
  level: number;
  title: string;
  description: string;
}

@Injectable()
export class CyclesService {
  constructor(private prisma: PrismaService) {}

  private getTenantId(): string {
    const tenantId = tenantContext.getStore()?.tenantId;
    if (!tenantId) throw new Error('Tenant não identificado');
    return tenantId;
  }

  // ── Cycles ──────────────────────────────────────────────

  async findAll() {
    const tenantId = this.getTenantId();
    return this.prisma.evaluationCycle.findMany({
      where: { tenantId },
      include: {
        questions: { orderBy: { createdAt: 'asc' } },
        scale: { orderBy: { level: 'asc' } },
        _count: { select: { evaluations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tenantId = this.getTenantId();
    return this.prisma.evaluationCycle.findFirstOrThrow({
      where: { id, tenantId },
      include: {
        questions: { orderBy: { createdAt: 'asc' } },
        scale: { orderBy: { level: 'asc' } },
        _count: { select: { evaluations: true } },
      },
    });
  }

  async create(data: CreateCycleDto) {
    const tenantId = this.getTenantId();
    return this.prisma.evaluationCycle.create({
      data: {
        ...data,
        tenantId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        startEmployeeDate: new Date(data.startEmployeeDate),
        endEmployeeDate: new Date(data.endEmployeeDate),
        ...(data.startManagerDate && { startManagerDate: new Date(data.startManagerDate) }),
        ...(data.endManagerDate && { endManagerDate: new Date(data.endManagerDate) }),
        ...(data.startCalibrationDate && { startCalibrationDate: new Date(data.startCalibrationDate) }),
        ...(data.endCalibrationDate && { endCalibrationDate: new Date(data.endCalibrationDate) }),
        managerAditionalDays: data.managerAditionalDays ?? 0,
        status: CycleStatus.DRAFT,
      },
      include: {
        questions: { orderBy: { createdAt: 'asc' } },
        scale: { orderBy: { level: 'asc' } },
        _count: { select: { evaluations: true } },
      },
    });
  }

  async update(id: string, data: Partial<CreateCycleDto> & { status?: CycleStatus }) {
    const tenantId = this.getTenantId();
    return this.prisma.evaluationCycle.update({
      where: { id },
      data: {
        ...data,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.startEmployeeDate && { startEmployeeDate: new Date(data.startEmployeeDate) }),
        ...(data.endEmployeeDate && { endEmployeeDate: new Date(data.endEmployeeDate) }),
        ...(data.startManagerDate && { startManagerDate: new Date(data.startManagerDate) }),
        ...(data.endManagerDate && { endManagerDate: new Date(data.endManagerDate) }),
        ...(data.startCalibrationDate && { startCalibrationDate: new Date(data.startCalibrationDate) }),
        ...(data.endCalibrationDate && { endCalibrationDate: new Date(data.endCalibrationDate) }),
      },
      include: {
        questions: { orderBy: { createdAt: 'asc' } },
        scale: { orderBy: { level: 'asc' } },
        _count: { select: { evaluations: true } },
      },
    });
  }

  async remove(id: string) {
    const tenantId = this.getTenantId();
    // deleteMany scopes by tenantId too, preventing cross-tenant deletion; cascade
    // rules on Evaluation/Question/EvaluationScale/Calibration*/PeerEvaluation take
    // care of removing everything related to this cycle.
    await this.prisma.evaluationCycle.deleteMany({ where: { id, tenantId } });
  }

  // ── Questions ────────────────────────────────────────────

  async findQuestions(cycleId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.question.findMany({
      where: { cycleId, tenantId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createQuestion(cycleId: string, data: CreateQuestionDto) {
    const tenantId = this.getTenantId();
    return this.prisma.question.create({
      data: { ...data, cycleId, tenantId },
    });
  }

  async updateQuestion(questionId: string, data: Partial<CreateQuestionDto>) {
    const tenantId = this.getTenantId();
    return this.prisma.question.update({
      where: { id: questionId },
      data,
    });
  }

  async removeQuestion(questionId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.question.delete({ where: { id: questionId } });
  }

  // ── Scale ────────────────────────────────────────────────

  async upsertScale(cycleId: string, levels: CreateScaleDto[]) {
    const tenantId = this.getTenantId();
    const ops = levels.map((item) =>
      this.prisma.evaluationScale.upsert({
        where: { cycleId_level: { cycleId, level: item.level } },
        create: { cycleId, level: item.level, title: item.title, description: item.description },
        update: { title: item.title, description: item.description },
      }),
    );
    return this.prisma.$transaction(ops);
  }

  // ── Launch: transition to RUNNING + generate evaluations ─────────────────

  async launch(cycleId: string) {
    const tenantId = this.getTenantId();

    const cycle = await this.prisma.evaluationCycle.findFirstOrThrow({
      where: { id: cycleId, tenantId },
    });

    // Allow re-running on an already RUNNING cycle to backfill evaluations for
    // employees who became eligible after launch (e.g. a manager promoted later).
    if (cycle.status !== CycleStatus.DRAFT && cycle.status !== CycleStatus.RUNNING) {
      throw new BadRequestException('Apenas ciclos em rascunho ou em andamento podem gerar avaliações');
    }

    // Determine which employees to include
    const employees = await this.prisma.user.findMany({
      where: {
        tenantId,
        // Eligibility is driven by isManager, not role: today some ADMINs also manage a
        // team (test data) and must self-evaluate; once ADMINs are pure system observers
        // with isManager=false, this OR naturally excludes them without further changes.
        OR: [{ role: { not: 'ADMIN' } }, { isManager: true }],
        // MANAGERS target: only users that are managers
        ...(cycle.target === 'MANAGERS' ? { isManager: true } : {}),
      },
      select: { id: true, managerId: true },
    });

    // Avoid duplicates — skip employees that already have an evaluation for this cycle
    const existing = await this.prisma.evaluation.findMany({
      where: { cycleId, tenantId },
      select: { employeeId: true },
    });
    const existingIds = new Set(existing.map((e) => e.employeeId));

    const toCreate = employees.filter(
      (e) => !existingIds.has(e.id) && e.managerId !== null,
    );

    await this.prisma.$transaction([
      // Update cycle status
      this.prisma.evaluationCycle.update({
        where: { id: cycleId },
        data: { status: CycleStatus.RUNNING },
      }),
      // Create one evaluation record per employee
      ...toCreate.map((e) =>
        this.prisma.evaluation.create({
          data: {
            cycleId,
            tenantId,
            employeeId: e.id,
            managerId: e.managerId!,
            status: EvaluationStatus.PENDING_SELF_REVIEW,
          },
        }),
      ),
    ]);

    return this.prisma.evaluationCycle.findFirstOrThrow({ where: { id: cycleId } });
  }
}
