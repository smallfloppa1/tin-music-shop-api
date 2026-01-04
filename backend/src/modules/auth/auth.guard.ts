import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './type/user-payload.interface';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'Authorization header is missing or invalid',
      );
    }

    try {
      request['user'] = await this.jwtService.verifyAsync<UserPayload>(token);
    } catch (error) {
      const err = error as Error;
      throw new UnauthorizedException('Session expired! Please sign in again');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
