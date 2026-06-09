import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EvaluationsService, CreateEvaluationDto, SubmitAnswerDto } from './evaluations.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly service: EvaluationsService) {}

  @Get()
  findAll(@Query('cycleId') cycleId?: string) {
    return this.service.findAll(cycleId);
  }

  @Get('summary')
  getCycleSummary(@Query('cycleId') cycleId: string) {
    return this.service.getCycleSummary(cycleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: CreateEvaluationDto) {
    return this.service.create(body);
  }

  @Post(':id/answers')
  submitAnswers(
    @Param('id') id: string,
    @Body() body: { answers: SubmitAnswerDto[] },
    @CurrentUser() user: { id: string },
  ) {
    return this.service.submitAnswers(id, body.answers, user.id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: any }) {
    return this.service.updateStatus(id, body.status);
  }
}
