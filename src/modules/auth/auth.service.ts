import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async login(email: string, password: string) {

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { company: true }
    });

    console.log(user);

    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(password, user.password);

    console.log(valid);

    if (!valid) throw new UnauthorizedException('Invalid password');

    const token = this.jwt.sign({
      userId: user.id,
      name: user.name,
      email: user.email,
      tenantId: user.tenantId,
      tenantName: user.company.name,
      role: user.role,
      isSuperAdmin: user.isSuperAdmin,
      isManager: user.isManager,
      area: user.area ?? null,
    });

    return { access_token: token };

  }

}