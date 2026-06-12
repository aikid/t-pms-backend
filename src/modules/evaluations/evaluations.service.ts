import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { tenantContext } from 'src/shared/context/tenant.context';
import { AnswerType, EvaluationStatus } from '@prisma/client';

export class CreateEvaluationDto {
  cycleId: string;
  employeeId: string;
  managerId: string;
}

export class SubmitAnswerDto {
  questionId: string;
  type: AnswerType;
  score: number;
  textAnswer?: string;
}

@Injectable()
export class EvaluationsService {
  constructor(private prisma: PrismaService) {}

  private getTenantId(): string {
    const tenantId = tenantContext.getStore()?.tenantId;
    if (!tenantId) throw new Error('Tenant não identificado');
    return tenantId;
  }

  async findAll(cycleId?: string) {
    const tenantId = this.getTenantId();
    return this.prisma.evaluation.findMany({
      where: { tenantId, ...(cycleId && { cycleId }) },
      include: {
        employee: { select: { id: true, name: true, position: true, area: true } },
        manager: { select: { id: true, name: true } },
        answers: true,
        cycle: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMine(userId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.evaluation.findMany({
      where: { tenantId, employeeId: userId },
      include: {
        employee: { select: { id: true, name: true, position: true, area: true } },
        manager: { select: { id: true, name: true } },
        answers: { include: { question: true } },
        cycle: { include: { questions: { orderBy: { createdAt: 'asc' } }, scale: { orderBy: { level: 'asc' } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAsManager(managerId: string, cycleId?: string) {
    const tenantId = this.getTenantId();
    return this.prisma.evaluation.findMany({
      where: { tenantId, managerId, ...(cycleId && { cycleId }) },
      include: {
        employee: { select: { id: true, name: true, position: true, area: true } },
        manager: { select: { id: true, name: true } },
        answers: true,
        cycle: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tenantId = this.getTenantId();
    return this.prisma.evaluation.findFirstOrThrow({
      where: { id, tenantId },
      include: {
        employee: { select: { id: true, name: true, position: true, area: true } },
        manager: { select: { id: true, name: true } },
        answers: { include: { question: true } },
        cycle: { include: { questions: true, scale: { orderBy: { level: 'asc' } } } },
        calibrations: true,
      },
    });
  }

  async create(data: CreateEvaluationDto) {
    const tenantId = this.getTenantId();
    return this.prisma.evaluation.create({
      data: {
        ...data,
        tenantId,
        status: EvaluationStatus.PENDING_SELF_REVIEW,
      },
    });
  }

  async submitAnswers(evaluationId: string, answers: SubmitAnswerDto[], userId: string) {
    const tenantId = this.getTenantId();
    const evaluation = await this.prisma.evaluation.findFirstOrThrow({
      where: { id: evaluationId, tenantId },
    });

    const isSelf = evaluation.employeeId === userId;
    const isManager = evaluation.managerId === userId;

    if (!isSelf && !isManager) {
      throw new ForbiddenException('Sem permissão para responder esta avaliação');
    }

    const answerType: AnswerType = isSelf ? AnswerType.SELF : AnswerType.MANAGER;

    // Upsert each answer
    const ops = answers.map((a) =>
      this.prisma.answer.upsert({
        where: {
          evaluationId_questionId_type: {
            evaluationId,
            questionId: a.questionId,
            type: answerType,
          },
        },
        create: {
          evaluationId,
          questionId: a.questionId,
          type: answerType,
          score: a.score,
          textAnswer: a.textAnswer,
        },
        update: {
          score: a.score,
          textAnswer: a.textAnswer,
        },
      }),
    );

    await this.prisma.$transaction(ops);

    // Compute aggregate score for self or manager
    const avgScore =
      answers.reduce((sum, a) => sum + (a.score ?? 0), 0) / answers.length;

    // Advance status
    let nextStatus = evaluation.status;
    if (isSelf && evaluation.status === EvaluationStatus.PENDING_SELF_REVIEW) {
      nextStatus = EvaluationStatus.PENDING_MANAGER_REVIEW;
    } else if (isManager && evaluation.status === EvaluationStatus.PENDING_MANAGER_REVIEW) {
      nextStatus = EvaluationStatus.AWAITING_CALIBRATION;
    }

    return this.prisma.evaluation.update({
      where: { id: evaluationId },
      data: {
        ...(isSelf ? { selfScore: avgScore } : { managerScore: avgScore }),
        status: nextStatus,
      },
    });
  }

  async updateStatus(id: string, status: EvaluationStatus) {
    const tenantId = this.getTenantId();
    return this.prisma.evaluation.update({ where: { id }, data: { status } });
  }

  async getCycleSummary(cycleId: string) {
    const tenantId = this.getTenantId();
    const evaluations = await this.prisma.evaluation.findMany({
      where: { tenantId, cycleId },
      select: { status: true, selfScore: true, managerScore: true, finalScore: true },
    });

    const total = evaluations.length;
    const selfDone = evaluations.filter(
      (e) => e.status !== EvaluationStatus.PENDING_SELF_REVIEW,
    ).length;
    const managerDone = evaluations.filter(
      (e) =>
        e.status === EvaluationStatus.AWAITING_CALIBRATION ||
        e.status === EvaluationStatus.CALIBRATING ||
        e.status === EvaluationStatus.CLOSED,
    ).length;
    const pending = total - selfDone;

    return { total, selfDone, managerDone, pending };
  }
}
