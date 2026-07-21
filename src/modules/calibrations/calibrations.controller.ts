import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  AddParticipantDto,
  CalibrationsService,
  CreateRoomDto,
  MoveEvaluationDto,
  SaveCalibrationConfigDto,
  SubmitCalibrationDto,
} from './calibrations.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('calibrations')
export class CalibrationsController {
  constructor(private readonly service: CalibrationsService) {}

  @Get()
  findByCycle(@Query('cycleId') cycleId: string) {
    return this.service.findByCycle(cycleId);
  }

  @Get('area-summary')
  getAreaSummary(@Query('cycleId') cycleId: string) {
    return this.service.getAreaSummary(cycleId);
  }

  @Get('curve')
  getCurveDistribution(@Query('cycleId') cycleId: string) {
    return this.service.getCurveDistribution(cycleId);
  }

  @Post()
  submitCalibration(
    @Body() body: SubmitCalibrationDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.service.submitCalibration(body, user.userId);
  }

  // ── Config endpoints ───────────────────────────────────────────────────────

  @Get('config')
  @Roles(Role.ADMIN, Role.MANAGER)
  getConfig(@Query('cycleId') cycleId: string) {
    return this.service.getConfig(cycleId);
  }

  @Post('config')
  @Roles(Role.ADMIN)
  saveConfig(@Body() body: SaveCalibrationConfigDto) {
    return this.service.saveConfig(body);
  }

  @Post('config/:cycleId/publish')
  @Roles(Role.ADMIN)
  publishConfig(@Param('cycleId') cycleId: string) {
    return this.service.publishConfig(cycleId);
  }

  // ── Room endpoints ─────────────────────────────────────────────────────────

  @Get('rooms')
  @Roles(Role.ADMIN, Role.MANAGER, Role.HR)
  listRooms(@Query('cycleId') cycleId: string) {
    return this.service.listRooms(cycleId);
  }

  @Post('rooms')
  @Roles(Role.ADMIN, Role.HR)
  createRoom(@Body() body: CreateRoomDto) {
    return this.service.createRoom(body);
  }

  @Delete('rooms/:id')
  @HttpCode(204)
  @Roles(Role.ADMIN, Role.HR)
  deleteRoom(@Param('id') id: string) {
    return this.service.deleteRoom(id);
  }

  @Post('rooms/seed')
  @Roles(Role.ADMIN, Role.HR)
  seedRooms(@Body('cycleId') cycleId: string) {
    return this.service.seedRooms(cycleId);
  }

  @Post('rooms/:id/evaluations')
  @HttpCode(204)
  @Roles(Role.ADMIN, Role.HR)
  addEvaluation(
    @Param('id') roomId: string,
    @Body('evaluationId') evaluationId: string,
  ) {
    return this.service.addEvaluationToRoom(roomId, evaluationId);
  }

  @Delete('rooms/:id/evaluations/:evaluationId')
  @HttpCode(204)
  @Roles(Role.ADMIN, Role.HR)
  removeEvaluation(
    @Param('id') roomId: string,
    @Param('evaluationId') evaluationId: string,
  ) {
    return this.service.removeEvaluationFromRoom(roomId, evaluationId);
  }

  @Patch('rooms/:id/evaluations/:evaluationId/move')
  @HttpCode(204)
  @Roles(Role.ADMIN, Role.HR)
  moveEvaluation(
    @Param('id') roomId: string,
    @Param('evaluationId') evaluationId: string,
    @Body() body: MoveEvaluationDto,
  ) {
    return this.service.moveEvaluation(roomId, evaluationId, body.targetRoomId);
  }

  @Post('rooms/:id/participants')
  @Roles(Role.ADMIN, Role.HR)
  addParticipant(@Param('id') roomId: string, @Body() body: AddParticipantDto) {
    return this.service.addParticipant(roomId, body);
  }

  @Delete('rooms/:id/participants/:userId')
  @HttpCode(204)
  @Roles(Role.ADMIN, Role.HR)
  removeParticipant(
    @Param('id') roomId: string,
    @Param('userId') userId: string,
  ) {
    return this.service.removeParticipant(roomId, userId);
  }
}
