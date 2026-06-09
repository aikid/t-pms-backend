import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { tenantContext } from 'src/shared/context/tenant.context';
import { CycleStatus, QuestionCategory, QuestionStatus, TargetCycle } from '@prisma/client';

export class CreateCycleDto {
  name: string;
  startDate: string;
  endDate: string;
  startEmployeeDate: string;
  endEmployeeDate: string;
  managerAditionalDays: number;
  target: TargetCycle;
}

export class CreateQuestionDto {
  title: string;
  description?: string;
  category: QuestionCategory;
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
    return this.prisma.evaluationCycle.delete({ where: { id } });
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
}
