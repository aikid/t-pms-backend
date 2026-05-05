import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();
    const auth = request.headers.authorization;

    if (!auth) return false;

    const token = auth.split(' ')[1];

    try {
      const decoded = this.jwt.verify(token);
      request.user = decoded;
      return true;
    } catch {
      return false;
    }

  }

}