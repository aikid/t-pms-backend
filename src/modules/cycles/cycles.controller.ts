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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cycles')
export class CyclesController {
  constructor(private readonly service: CyclesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: CreateCycleDto) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // ── Questions ──────────────────────────────────────────────

  @Get(':id/questions')
  findQuestions(@Param('id') id: string) {
    return this.service.findQuestions(id);
  }

  @Post(':id/questions')
  createQuestion(@Param('id') id: string, @Body() body: CreateQuestionDto) {
    return this.service.createQuestion(id, body);
  }

  @Patch(':id/questions/:questionId')
  updateQuestion(@Param('questionId') questionId: string, @Body() body: Partial<CreateQuestionDto>) {
    return this.service.updateQuestion(questionId, body);
  }

  @Delete(':id/questions/:questionId')
  removeQuestion(@Param('questionId') questionId: string) {
    return this.service.removeQuestion(questionId);
  }

  // ── Scale ─────────────────────────────────────────────────

  @Put(':id/scale')
  upsertScale(@Param('id') id: string, @Body() body: CreateScaleDto[]) {
    return this.service.upsertScale(id, body);
  }
}
