import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CyclesService, CreateCycleDto, CreateQuestionDto, CreateScaleDto } from './cycles.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cycles')
export class CyclesController {
  constructor(private readonly service: CyclesService) {}

  // ── Read — accessible to any authenticated user ─────────────────────────

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/questions')
  findQuestions(@Param('id') id: string) {
    return this.service.findQuestions(id);
  }

  // ── Mutations — ADMIN only ───────────────────────────────────────────────

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() body: CreateCycleDto) {
    return this.service.create(body);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // ── Questions — ADMIN only ───────────────────────────────────────────────

  @Post(':id/questions')
  @Roles(Role.ADMIN)
  createQuestion(@Param('id') id: string, @Body() body: CreateQuestionDto) {
    return this.service.createQuestion(id, body);
  }

  @Patch(':id/questions/:questionId')
  @Roles(Role.ADMIN)
  updateQuestion(@Param('questionId') questionId: string, @Body() body: Partial<CreateQuestionDto>) {
    return this.service.updateQuestion(questionId, body);
  }

  @Delete(':id/questions/:questionId')
  @Roles(Role.ADMIN)
  removeQuestion(@Param('questionId') questionId: string) {
    return this.service.removeQuestion(questionId);
  }

  // ── Scale — ADMIN only ───────────────────────────────────────────────────

  @Put(':id/scale')
  @Roles(Role.ADMIN)
  upsertScale(@Param('id') id: string, @Body() body: CreateScaleDto[]) {
    return this.service.upsertScale(id, body);
  }

  // ── Launch ────────────────────────────────────────────────────────────────

  @Post(':id/launch')
  @Roles(Role.ADMIN)
  launch(@Param('id') id: string) {
    return this.service.launch(id);
  }
}
