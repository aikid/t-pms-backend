import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CalibrationsService, SaveCalibrationConfigDto, SubmitCalibrationDto } from './calibrations.service';
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
}
