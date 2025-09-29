import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Routes } from 'src/shared/enums/routes.enum';
import { SuccessResponse } from 'src/shared/dtos/success-response.dto';
import { ResponseMessages } from 'src/shared/enums/response-messages.enum';
import { LoginDto } from './dto/login.dto';
import { Serialize } from 'src/shared';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(Routes.LOGIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(LoginResponseDto)
  async login(@Body() loginDto: LoginDto, @Request() req: Request) {
    const result = await this.authService.login(
      loginDto,
      // req.,
      // req.get('User-Agent'),
    );
    return new SuccessResponse(ResponseMessages.LOGIN_SUCCESSFUL, result);
  }

  // @Post(Routes.REFRESH_TOKEN)
  // @HttpCode(HttpStatus.OK)
  // async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
  //   const tokens = await this.authService.refreshTokens(
  //     refreshTokenDto.refreshToken,
  //   );
  //   return new SuccessResponse(ResponseMessages.OPERATION_SUCCESSFUL, tokens);
  // }

  // @Post(Routes.LOGOUT)
  // @HttpCode(HttpStatus.OK)
  // async logout(@Request() req) {
  //   await this.authService.logout(req.user.id, req.ip, req.get('User-Agent'));
  //   return new SuccessResponse(ResponseMessages.LOGOUT_SUCCESSFUL);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put('change-password')
  // @HttpCode(HttpStatus.OK)
  // async changePassword(
  //   @Body() changePasswordDto: ChangePasswordDto,
  //   @Request() req,
  // ) {
  //   await this.authService.changePassword(
  //     req.user.id,
  //     changePasswordDto,
  //     req.ip,
  //     req.get('User-Agent'),
  //   );
  //   return new SuccessResponse('Password changed successfully');
  // }
}
