import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EvaluationsService, CreateEvaluationDto, SubmitAnswerDto } from './evaluations.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly service: EvaluationsService) {}

  // ── ADMIN only: list all evaluations, create, summary, update status ────

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  findAll(@Query('cycleId') cycleId?: string) {
    return this.service.findAll(cycleId);
  }

  @Get('summary')
  @Roles(Role.ADMIN, Role.MANAGER)
  getCycleSummary(@Query('cycleId') cycleId: string) {
    return this.service.getCycleSummary(cycleId);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: CreateEvaluationDto) {
    return this.service.create(body);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.MANAGER)
  updateStatus(@Param('id') id: string, @Body() body: { status: any }) {
    return this.service.updateStatus(id, body.status);
  }

  // ── Accessible to authenticated users (own evaluations) ─────────────────

  @Get('mine')
  findMine(@CurrentUser() user: { userId: string }) {
    return this.service.findMine(user.userId);
  }

  @Get('as-manager')
  findAsManager(
    @CurrentUser() user: { userId: string },
    @Query('cycleId') cycleId?: string,
  ) {
    return this.service.findAsManager(user.userId, cycleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/answers')
  submitAnswers(
    @Param('id') id: string,
    @Body() body: { answers: SubmitAnswerDto[] },
    @CurrentUser() user: { userId: string; role: string; isSuperAdmin: boolean },
  ) {
    const isAdmin = user.isSuperAdmin || user.role === 'ADMIN';
    return this.service.submitAnswers(id, body.answers, user.userId, isAdmin);
  }

  // ── Peer evaluations (colleagues sharing the same manager) ──────────────

  @Get('peers/mine')
  findMyPeers(@CurrentUser() user: { userId: string }, @Query('cycleId') cycleId?: string) {
    return this.service.findMyPeers(user.userId, cycleId);
  }

  @Post('peers/:id/answers')
  submitPeerAnswers(
    @Param('id') id: string,
    @Body() body: { answers: { questionId: string; score: number; textAnswer?: string }[] },
    @CurrentUser() user: { userId: string },
  ) {
    return this.service.submitPeerAnswers(id, body.answers, user.userId);
  }
}
