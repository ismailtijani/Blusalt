import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  AuthGuard,
  CurrentUser,
  GetIpAddress,
  GetUser,
  GetUserAgent,
  Routes,
  Serialize,
} from 'src/shared';
import { ResponseMessages } from 'src/shared/enums/response-messages.enum';
import { SuccessResponse } from 'src/shared/dtos/success-response.dto';
import { GetAdminsQueryDto } from './dto/admin-query.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { AdminLoginResponseDto } from './dto/admin-login-response.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post(Routes.LOGIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(AdminLoginResponseDto)
  async login(
    @Body() loginDto: LoginDto,
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    const response = await this.adminService.login(loginDto);
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    const response = await this.adminService.createAdmin(createAdminDto);

    this.eventEmitter.emit('onUserActivity', {
      action: createAdminDto,
      description: 'Create Admin User',
      feedback: '',
      identity: response.email,
      maskedAction: false,
      maskedFeedback: false,
      what: req.originalUrl,
      when: new Date().toISOString(),
      owner: response.id,
      ipAddress,
      userAgent,
    });
    return new SuccessResponse(ResponseMessages.USER_CREATED);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Serialize(AdminResponseDto)
  async getAllAdmins(@Query() queryData: GetAdminsQueryDto) {
    const response = await this.adminService.getAllAdmins(queryData);
    return new SuccessResponse(ResponseMessages.USERS_RETRIEVED, response);
  }
}
