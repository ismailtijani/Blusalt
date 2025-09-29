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
    // private readonly auditLogService: AuditLogService,
  ) {}

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = await this.jwtService.generateTokens(payload);
    await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
    await this.userService.updateLastLogin(user.id);

    // await this.auditLogService.log({
    //   action: 'LOGIN',
    //   entityType: 'User',
    //   entityId: user.id,
    //   userId: user.id,
    //   description: `User logged in: ${user.email}`,
    //   ipAddress,
    //   userAgent,
    // });

    return { ...user, ...tokens };
  }

  // async logout(
  //   userId: string,
  //   ipAddress?: string,
  //   userAgent?: string,
  // ): Promise<void> {
  //   await this.userService.updateRefreshToken(userId, null);

  //   // await this.auditLogService.log({
  //   //   action: 'LOGOUT',
  //   //   entityType: 'User',
  //   //   entityId: userId,
  //   //   userId,
  //   //   description: 'User logged out',
  //   //   ipAddress,
  //   //   userAgent,
  //   // });
  // }

  // async refreshTokens(refreshToken: string): Promise<Tokens> {
  //   try {
  //     const payload = await this.jwtService.verifyAsync(refreshToken, {
  //       secret: this.configService.get('JWT_REFRESH_SECRET'),
  //     });

  //     const user = await this.userService.findById(payload.sub);

  //     if (!user.refreshToken || user.refreshToken !== refreshToken) {
  //       throw new UnauthorizedException('Invalid refresh token');
  //     }

  //     const tokens = await this.generateTokens(user);
  //     await this.userService.updateRefreshToken(user.id, tokens.refreshToken);

  //     return tokens;
  //   } catch (error) {
  //     throw new UnauthorizedException('Invalid refresh token');
  //   }
  // }

  // /**
  //  * Change user password
  //  */
  // async changePassword(
  //   userId: string,
  //   changePasswordDto: ChangePasswordDto,
  //   ipAddress?: string,
  //   userAgent?: string,
  // ): Promise<void> {
  //   const user = await this.userService.findById(userId);

  //   const isOldPasswordValid = await this.userService.validatePassword(
  //     changePasswordDto.oldPassword,
  //     user.password,
  //   );

  //   if (!isOldPasswordValid) {
  //     throw new BadRequestException('Invalid old password');
  //   }

  //   const saltRounds = this.configService.get('BCRYPT_ROUNDS', 12);
  //   const hashedNewPassword = await bcrypt.hash(
  //     changePasswordDto.newPassword,
  //     saltRounds,
  //   );

  //   await this.userService.update(userId, { password: hashedNewPassword });

  //   // Invalidate all refresh tokens
  //   await this.userService.updateRefreshToken(userId, null);

  //   await this.auditLogService.log({
  //     action: 'UPDATE',
  //     entityType: 'User',
  //     entityId: userId,
  //     userId,
  //     description: 'Password changed',
  //     ipAddress,
  //     userAgent,
  //   });
  // }

  /**
   * Validate user credentials
   */
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
      throw new UnauthorizedException('Account is deactivated');
    }

    return user;
  }
}
