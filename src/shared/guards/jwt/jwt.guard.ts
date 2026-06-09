import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { tenantContext } from '../../context/tenant.context';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;

    if (!auth) throw new UnauthorizedException('Token não fornecido');

    const token = auth.split(' ')[1];

    try {
      const decoded = this.jwt.verify(token);
      request.user = decoded;
      tenantContext.enterWith({ tenantId: decoded.tenantId });
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

  }

}