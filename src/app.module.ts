import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantMiddleware } from './shared/middleware/tenant/tenant.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompanyModule } from './modules/company/company.module';
import { CyclesModule } from './modules/cycles/cycles.module';
import { EvaluationsModule } from './modules/evaluations/evaluations.module';
import { CalibrationsModule } from './modules/calibrations/calibrations.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedModule,
    DatabaseModule,
    UsersModule,
    PrismaModule,
    AuthModule,
    CompanyModule,
    CyclesModule,
    EvaluationsModule,
    CalibrationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
