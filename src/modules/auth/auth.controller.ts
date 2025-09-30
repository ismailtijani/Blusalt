import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Routes } from 'src/shared/enums/routes.enum';
import { SuccessResponse } from 'src/shared/dtos/success-response.dto';
import { ResponseMessages } from 'src/shared/enums/response-messages.enum';
import { LoginDto } from './dto/login.dto';
import {
  CurrentUser,
  GetIpAddress,
  GetUser,
  GetUserAgent,
  Serialize,
} from 'src/shared';
import { LoginResponseDto } from './dto/login-response.dto';
import { Request } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post(Routes.LOGIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(LoginResponseDto)
  async login(
    @Body() loginDto: LoginDto,
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    const response = await this.authService.login(loginDto);
    // Emit activity log
    this.eventEmitter.emit('onUserActivity', {
      action: loginDto,
      description: 'User Login',
      feedback: response,
      identity: response.email,
      maskedAction: false,
      maskedFeedback: false,
      what: req.originalUrl,
      when: new Date().toISOString(),
      owner: response.id,
      ipAddress,
      userAgent,
    });
    return new SuccessResponse(ResponseMessages.LOGIN_SUCCESSFUL, response);
  }
}
