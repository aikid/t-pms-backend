import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Tenant } from '../../shared/decorators/tenant.decorator';

@Controller('users')
export class UsersController {

  constructor(private service: UsersService) {}

  @Post()
  create(
    @Body() body: any,
  ) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

}