import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { tenantContext } from 'src/shared/context/tenant.context';
import { CalibrationDecision, EvaluationStatus } from '@prisma/client';

export class SubmitCalibrationDto {
  evaluationId: string;
  calibratedScore: number;
  decision: CalibrationDecision;
  comment?: string;
}

export class SaveCalibrationConfigDto {
  cycleId: string;
  model: string;
  calibrableField: string;
  roomFormation: string;
  configData?: Record<string, any>;
}

@Injectable()
export class CalibrationsService {
  constructor(private prisma: PrismaService) {}

  private getTenantId(): string {
    const tenantId = tenantContext.getStore()?.tenantId;
    if (!tenantId) throw new Error('Tenant não identificado');
    return tenantId;
  }

  async findByCycle(cycleId: string) {
    const tenantId = this.getTenantId();
    const evaluations = await this.prisma.evaluation.findMany({
      where: { tenantId, cycleId },
      include: {
        employee: { select: { id: true, name: true, area: true } },
        manager: { select: { id: true, name: true } },
        calibrations: {
          include: { reviewer: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return evaluations.map((ev) => {
      const lastCalibration = ev.calibrations[0] ?? null;
      return {
        evaluationId: ev.id,
        employee: ev.employee,
        manager: ev.manager,
        selfScore: ev.selfScore,
        managerScore: ev.managerScore,
        finalScore: ev.finalScore,
        status: ev.status,
        calibratedScore: lastCalibration?.calibratedScore ?? null,
        calibrationDecision: lastCalibration?.decision ?? CalibrationDecision.PENDING,
        calibrationComment: lastCalibration?.comment ?? null,
      };
    });
  }

  async getAreaSummary(cycleId: string) {
    const tenantId = this.getTenantId();
    const evaluations = await this.prisma.evaluation.findMany({
      where: { tenantId, cycleId },
      include: {
        employee: { select: { area: true } },
        calibrations: { select: { decision: true }, take: 1, orderBy: { createdAt: 'desc' } },
        manager: { select: { id: true } },
      },
    });

    const areaMap: Record<
      string,
      { total: number; agreements: number; divergences: number; pending: number; reviewers: Set<string> }
    > = {};

    for (const ev of evaluations) {
      const area = ev.employee.area;
      if (!areaMap[area]) {
        areaMap[area] = { total: 0, agreements: 0, divergences: 0, pending: 0, reviewers: new Set() };
      }
      areaMap[area].total++;
      areaMap[area].reviewers.add(ev.managerId);

      const decision = ev.calibrations[0]?.decision;
      if (!decision || decision === CalibrationDecision.PENDING) {
        areaMap[area].pending++;
      } else if (decision === CalibrationDecision.AGREE) {
        areaMap[area].agreements++;
      } else {
        areaMap[area].divergences++;
      }
    }

    return Object.entries(areaMap).map(([area, data]) => ({
      area,
      total: data.total,
      reviewers: data.reviewers.size,
      agreements: data.agreements,
      divergences: data.divergences,
      pending: data.pending,
    }));
  }

  async getCurveDistribution(cycleId: string) {
    const tenantId = this.getTenantId();
    const evaluations = await this.prisma.evaluation.findMany({
      where: { tenantId, cycleId },
      select: { selfScore: true, managerScore: true, finalScore: true },
    });

    const curve: Record<number, { current: number; calibrated: number }> = {
      1: { current: 0, calibrated: 0 },
      2: { current: 0, calibrated: 0 },
      3: { current: 0, calibrated: 0 },
      4: { current: 0, calibrated: 0 },
      5: { current: 0, calibrated: 0 },
    };

    for (const ev of evaluations) {
      const raw = ev.managerScore ?? ev.selfScore;
      const final = ev.finalScore;
      if (raw && raw >= 1 && raw <= 5) curve[Math.round(raw)].current++;
      if (final && final >= 1 && final <= 5) curve[Math.round(final)].calibrated++;
    }

    return Object.entries(curve).map(([level, counts]) => ({
      level,
      current: counts.current,
      calibrated: counts.calibrated,
    }));
  }

  async submitCalibration(dto: SubmitCalibrationDto, reviewerId: string) {
    const tenantId = this.getTenantId();

    const calibration = await this.prisma.calibration.create({
      data: {
        evaluationId: dto.evaluationId,
        reviewerId,
        calibratedScore: dto.calibratedScore,
        decision: dto.decision,
        comment: dto.comment,
      },
    });

    // If agreed or adjusted, close the evaluation with the calibrated score
    if (dto.decision !== CalibrationDecision.PENDING) {
      await this.prisma.evaluation.update({
        where: { id: dto.evaluationId },
        data: {
          finalScore: dto.calibratedScore,
          status:
            dto.decision === CalibrationDecision.DISAGREE
              ? EvaluationStatus.CALIBRATING
              : EvaluationStatus.CLOSED,
        },
      });
    }

    return calibration;
  }

  // ── Calibration Config ────────────────────────────────────────────────────

  async getConfig(cycleId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.calibrationConfig.findUnique({
      where: { cycleId },
    });
  }

  async saveConfig(dto: SaveCalibrationConfigDto) {
    const tenantId = this.getTenantId();

    const existing = await this.prisma.calibrationConfig.findUnique({
      where: { cycleId: dto.cycleId },
    });

    if (existing?.isPublished) {
      throw new BadRequestException('Configuração de calibração já publicada e não pode ser alterada.');
    }

    return this.prisma.calibrationConfig.upsert({
      where: { cycleId: dto.cycleId },
      create: {
        cycleId: dto.cycleId,
        tenantId,
        model: dto.model,
        calibrableField: dto.calibrableField,
        roomFormation: dto.roomFormation,
        ...(dto.configData !== undefined && { configData: dto.configData }),
      },
      update: {
        model: dto.model,
        calibrableField: dto.calibrableField,
        roomFormation: dto.roomFormation,
        ...(dto.configData !== undefined && { configData: dto.configData }),
      },
    });
  }

  async publishConfig(cycleId: string) {
    const tenantId = this.getTenantId();

    const existing = await this.prisma.calibrationConfig.findUnique({
      where: { cycleId },
    });

    if (existing?.isPublished) {
      throw new BadRequestException('Configuração já foi publicada.');
    }

    return this.prisma.calibrationConfig.upsert({
      where: { cycleId },
      create: {
        cycleId,
        tenantId,
        isPublished: true,
        publishedAt: new Date(),
      },
      update: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }
}
