import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from 'src/config';
import { JwtPayload, Tokens } from '../interfaces/interface';
import { ErrorMessages } from '../enums/error-messages.enum';

@Injectable()
export class JwtHandler {
  private readonly logger = new Logger(JwtHandler.name);
  private readonly SECRET: string;
  private readonly TOKEN_EXPIRATION: string;
  private readonly RT_SECRET: string;
  private readonly JWT_REFRESH_EXPIRES_IN: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.SECRET = AppConfig(this.config).JWT_SECRET;
    this.RT_SECRET = AppConfig(this.config).JWT_REFRESH_SECRET;
    this.TOKEN_EXPIRATION = AppConfig(this.config).JWT_EXPIRES_IN;
    this.JWT_REFRESH_EXPIRES_IN = AppConfig(this.config).JWT_REFRESH_EXPIRES_IN;
  }

  async generateTokens(payload: JwtPayload): Promise<Tokens> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.SECRET,
          expiresIn: this.TOKEN_EXPIRATION,
        }),
        this.jwtService.signAsync(payload, {
          secret: this.RT_SECRET,
          expiresIn: this.JWT_REFRESH_EXPIRES_IN,
        }),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('Error generating tokens:', error);
      throw new InternalServerErrorException();
    }
  }

  async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch (error) {
      this.logger.error('Error validating token:', error);
      throw new BadRequestException(ErrorMessages.TOKEN_ERROR);
    }
  }

  async generateRefreshTokens(refreshToken: string): Promise<Tokens> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.RT_SECRET,
        },
      );

      return await this.generateTokens({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      });
    } catch (error) {
      this.logger.error('Token refresh failed:', error);
      throw new BadRequestException(ErrorMessages.INVALID_AUTH_TOKEN_ERROR);
    }
  }
}
