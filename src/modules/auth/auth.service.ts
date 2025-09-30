import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import { JwtHandler } from 'src/shared/services/jwt-service';
import { ErrorMessages, HelperService, JwtPayload } from 'src/shared';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtHandler,
    private readonly helperService: HelperService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = await this.jwtService.generateTokens(payload);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    await this.userService.updateLastLogin(user.id);

    return { ...user, ...tokens };
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.helperService.compareHashedData(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new UnauthorizedException(ErrorMessages.ACCOUNT_DISABLED);
    }

    return user;
  }
}
