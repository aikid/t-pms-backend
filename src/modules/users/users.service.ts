import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { tenantContext } from 'src/shared/context/tenant.context';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const tenantId = tenantContext.getStore()?.tenantId;
    const hash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data: { ...data, password: hash, tenantId } });
  }

  async findAll() {
    const tenantId = tenantContext.getStore()?.tenantId;
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        position: true,
        role: true,
        area: true,
        isManager: true,
        isSuperAdmin: true,
        managerId: true,
        managerEmail: true,
        createdAt: true,
        manager: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

}