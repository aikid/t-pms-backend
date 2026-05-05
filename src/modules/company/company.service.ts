import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Injectable()
export class CompanyService {

  constructor(private prisma: PrismaService) {}

  async createCompany(name: string) {
    return this.prisma.company.create({
        data: {
            name: name
        }
    });
   }

}