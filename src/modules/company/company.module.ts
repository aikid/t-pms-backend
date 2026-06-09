import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { SuperAdminGuard } from '../../shared/guards/super-admin/super-admin.guard';

@Module({
  imports: [JwtModule],
  providers: [CompanyService, SuperAdminGuard],
  controllers: [CompanyController]
})
export class CompanyModule {}
