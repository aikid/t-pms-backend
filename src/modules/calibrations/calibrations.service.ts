import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

export class CreateRoomDto {
  cycleId: string;
  name: string;
}

export class AddParticipantDto {
  userId: string;
  role?: string;
}

export class MoveEvaluationDto {
  targetRoomId: string;
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
        employee: { select: { id: true, name: true, area: true, level: true } },
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

  // ── Calibration Rooms ─────────────────────────────────────────────────────

  private roomInclude = {
    evaluations: {
      include: {
        evaluation: {
          include: {
            employee: { select: { id: true, name: true, position: true, area: true, level: true } },
            manager: { select: { id: true, name: true } },
          },
        },
      },
    },
    participants: {
      include: { user: { select: { id: true, name: true, position: true } } },
    },
  };

  async listRooms(cycleId: string) {
    const tenantId = this.getTenantId();
    return this.prisma.calibrationRoom.findMany({
      where: { cycleId, tenantId },
      include: this.roomInclude,
      orderBy: { name: 'asc' },
    });
  }

  async createRoom(dto: CreateRoomDto) {
    const tenantId = this.getTenantId();
    return this.prisma.calibrationRoom.create({
      data: { cycleId: dto.cycleId, tenantId, name: dto.name },
      include: this.roomInclude,
    });
  }

  async deleteRoom(roomId: string) {
    const tenantId = this.getTenantId();
    await this.prisma.calibrationRoom.deleteMany({ where: { id: roomId, tenantId } });
  }

  /** Auto-creates rooms from cycle evaluations.
   *  RULE    → groups by area + level  (e.g. "DEV - Sênior", "DEV - Pleno")
   *  COLUMNS → groups by area only     (e.g. "DEV", "RH")
   *  Deletes all existing rooms for the cycle before recreating, then auto-adds managers as participants.
   */
  async seedRooms(cycleId: string) {
    const tenantId = this.getTenantId();

    const config = await this.prisma.calibrationConfig.findUnique({ where: { cycleId } });
    const byAreaAndLevel = config?.roomFormation === 'RULE';

    // Delete all existing rooms (and their evaluations/participants via cascade) before recreating
    await this.prisma.calibrationRoom.deleteMany({ where: { cycleId, tenantId } });

    const evaluations = await this.prisma.evaluation.findMany({
      where: { tenantId, cycleId },
      include: { employee: { select: { area: true, level: true } } },
    });

    const groupMap: Record<string, string[]> = {};
    for (const ev of evaluations) {
      const area = ev.employee.area || 'Sem área';
      const level = ev.employee.level;
      const key = byAreaAndLevel && level
        ? `${area} - ${level}`
        : area;
      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push(ev.id);
    }

    for (const [name, evalIds] of Object.entries(groupMap)) {
      const room = await this.prisma.calibrationRoom.create({
        data: { cycleId, tenantId, name },
      });

      for (const evaluationId of evalIds) {
        await this.prisma.calibrationRoomEvaluation.create({
          data: { roomId: room.id, evaluationId },
        });
      }

      // Auto-add unique managers of this room's evaluations as participants
      const roomEvals = evaluations.filter((ev) => evalIds.includes(ev.id));
      const managerIds = [...new Set(roomEvals.map((ev) => ev.managerId).filter(Boolean))];
      for (const userId of managerIds) {
        await this.prisma.calibrationRoomParticipant.create({
          data: { roomId: room.id, userId, role: 'MANAGER_RESPONSIBLE' },
        });
      }
    }

    return this.listRooms(cycleId);
  }

  async addEvaluationToRoom(roomId: string, evaluationId: string) {
    const tenantId = this.getTenantId();
    const room = await this.prisma.calibrationRoom.findFirst({ where: { id: roomId, tenantId } });
    if (!room) throw new NotFoundException('Sala não encontrada');

    await this.prisma.calibrationRoomEvaluation.upsert({
      where: { evaluationId },
      create: { roomId, evaluationId },
      update: { roomId },
    });
  }

  async removeEvaluationFromRoom(roomId: string, evaluationId: string) {
    await this.prisma.calibrationRoomEvaluation.deleteMany({
      where: { roomId, evaluationId },
    });
  }

  async moveEvaluation(roomId: string, evaluationId: string, targetRoomId: string) {
    const tenantId = this.getTenantId();
    const target = await this.prisma.calibrationRoom.findFirst({ where: { id: targetRoomId, tenantId } });
    if (!target) throw new NotFoundException('Sala de destino não encontrada');

    await this.prisma.calibrationRoomEvaluation.upsert({
      where: { evaluationId },
      create: { roomId: targetRoomId, evaluationId },
      update: { roomId: targetRoomId },
    });
  }

  async addParticipant(roomId: string, dto: AddParticipantDto) {
    const tenantId = this.getTenantId();
    const room = await this.prisma.calibrationRoom.findFirst({ where: { id: roomId, tenantId } });
    if (!room) throw new NotFoundException('Sala não encontrada');

    return this.prisma.calibrationRoomParticipant.upsert({
      where: { roomId_userId: { roomId, userId: dto.userId } },
      create: { roomId, userId: dto.userId, role: dto.role ?? 'REVIEWER' },
      update: { role: dto.role ?? 'REVIEWER' },
    });
  }

  async removeParticipant(roomId: string, userId: string) {
    await this.prisma.calibrationRoomParticipant.deleteMany({ where: { roomId, userId } });
  }
}
