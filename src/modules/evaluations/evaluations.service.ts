import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { tenantContext } from 'src/shared/context/tenant.context';
import { AnswerType, CycleStatus, EvaluationStatus } from '@prisma/client';

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
        answers: { include: { question: true } },
        cycle: { include: { questions: { orderBy: { createdAt: 'asc' } }, scale: { orderBy: { level: 'asc' } } } },
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

  async submitAnswers(evaluationId: string, answers: SubmitAnswerDto[], userId: string, isAdmin = false) {
    const tenantId = this.getTenantId();
    const evaluation = await this.prisma.evaluation.findFirstOrThrow({
      where: { id: evaluationId, tenantId },
    });

    const isSelf = evaluation.employeeId === userId;
    const isManager = evaluation.managerId === userId;

    if (!isSelf && !isManager && !isAdmin) {
      throw new ForbiddenException('Sem permissão para responder esta avaliação');
    }

    // Admins submitting for someone else act as the manager
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
    } else if (!isSelf && evaluation.status === EvaluationStatus.PENDING_MANAGER_REVIEW) {
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

  // ── Peer evaluations ──────────────────────────────────────────────────────

  async findMyPeers(userId: string, cycleId?: string) {
    const tenantId = this.getTenantId();

    const cycle = cycleId
      ? await this.prisma.evaluationCycle.findFirstOrThrow({ where: { id: cycleId, tenantId } })
      : await this.prisma.evaluationCycle.findFirst({
          where: { tenantId, status: CycleStatus.RUNNING },
          orderBy: { createdAt: 'desc' },
        });

    if (!cycle) return [];

    const me = await this.prisma.user.findFirstOrThrow({ where: { id: userId, tenantId } });
    if (!me.managerId) return [];

    const peers = await this.prisma.user.findMany({
      where: { tenantId, managerId: me.managerId, id: { not: userId } },
      select: { id: true, name: true, position: true, area: true },
    });

    if (peers.length === 0) return [];

    // Ensure a PeerEvaluation record exists for each peer in this cycle
    await this.prisma.$transaction(
      peers.map((p) =>
        this.prisma.peerEvaluation.upsert({
          where: {
            cycleId_evaluatorId_evaluateeId: {
              cycleId: cycle.id,
              evaluatorId: userId,
              evaluateeId: p.id,
            },
          },
          create: { tenantId, cycleId: cycle.id, evaluatorId: userId, evaluateeId: p.id },
          update: {},
        }),
      ),
    );

    return this.prisma.peerEvaluation.findMany({
      where: { tenantId, cycleId: cycle.id, evaluatorId: userId },
      include: {
        evaluatee: { select: { id: true, name: true, position: true, area: true } },
        answers: { include: { question: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async submitPeerAnswers(
    peerEvaluationId: string,
    answers: { questionId: string; score: number; textAnswer?: string }[],
    userId: string,
  ) {
    const tenantId = this.getTenantId();
    const peerEvaluation = await this.prisma.peerEvaluation.findFirstOrThrow({
      where: { id: peerEvaluationId, tenantId },
    });

    if (peerEvaluation.evaluatorId !== userId) {
      throw new ForbiddenException('Sem permissão para responder esta avaliação de pares');
    }

    const ops = answers.map((a) =>
      this.prisma.peerAnswer.upsert({
        where: {
          peerEvaluationId_questionId: {
            peerEvaluationId,
            questionId: a.questionId,
          },
        },
        create: {
          peerEvaluationId,
          questionId: a.questionId,
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

    const avgScore = answers.length > 0 ? answers.reduce((sum, a) => sum + (a.score ?? 0), 0) / answers.length : null;

    return this.prisma.peerEvaluation.update({
      where: { id: peerEvaluationId },
      data: { score: avgScore, status: 'SUBMITTED' },
    });
  }
}
