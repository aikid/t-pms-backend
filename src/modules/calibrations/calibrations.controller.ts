import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CalibrationsService, SubmitCalibrationDto } from './calibrations.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

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
    @CurrentUser() user: { id: string },
  ) {
    return this.service.submitCalibration(body, user.id);
  }
}
