import { Module } from '@nestjs/common';
import { CalibrationsController } from './calibrations.controller';
import { CalibrationsService } from './calibrations.service';
import { PrismaModule } from 'src/infrastructure/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CalibrationsController],
  providers: [CalibrationsService],
  exports: [CalibrationsService],
})
export class CalibrationsModule {}
