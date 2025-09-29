import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../constants/app.constants';
import { ErrorMessages } from '../enums/error-messages.enum';
import { JwtPayload } from '../interfaces/interface';
import { AppConfig } from 'src/config';

interface AuthenticatedRequest extends Request {
  user?: any; // or user?: JwtPayload if you want stricter typing
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(ErrorMessages.INVALID_AUTH_TOKEN_ERROR);
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: AppConfig(this.configService).JWT_SECRET,
      });
      request.user = payload;
    } catch (error) {
      this.logger.error(`Token validation failed: ${JSON.stringify(error)}`);
      throw new UnauthorizedException(ErrorMessages.TOKEN_ERROR);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
