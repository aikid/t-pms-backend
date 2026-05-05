import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../../shared/guards/jwt/jwt.guard';

@Controller('companies')
export class CompanyController {

  constructor(private service: CompanyService) {}

  //@UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.service.createCompany(body.name);
  }

}