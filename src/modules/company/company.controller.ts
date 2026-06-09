import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../../shared/guards/jwt/jwt.guard';
import { SuperAdminGuard } from '../../shared/guards/super-admin/super-admin.guard';

@Controller('companies')
export class CompanyController {

  constructor(private service: CompanyService) {}

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Post()
  create(@Body() body: any) {
    return this.service.createCompany(body.name);
  }

  //@UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  //@UseGuards(JwtAuthGuard)
  @Get(':id/parameters')
  getParameters(@Param('id') id: string) {
    return this.service.getParameters(id);
  }

  //@UseGuards(JwtAuthGuard)
  @Put(':id/parameters')
  upsertParameters(
    @Param('id') id: string,
    @Body() body: { key: string; value: string }[],
  ) {
    return this.service.upsertParameters(id, body);
  }

}