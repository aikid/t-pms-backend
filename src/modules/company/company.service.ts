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

  async findAll() {
    return this.prisma.company.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getParameters(companyId: string) {
    return this.prisma.companyParameter.findMany({
      where: { companyId },
      orderBy: { key: 'asc' },
    });
  }

  async upsertParameters(companyId: string, params: { key: string; value: string }[]) {
    const upserts = params.map((p) =>
      this.prisma.companyParameter.upsert({
        where: { companyId_key: { companyId, key: p.key } },
        create: { companyId, key: p.key, value: p.value },
        update: { value: p.value },
      }),
    );
    return this.prisma.$transaction(upserts);
  }

}