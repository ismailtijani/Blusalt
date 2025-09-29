import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Routes, Serialize } from 'src/shared';
import { ResponseMessages } from 'src/shared/enums/response-messages.enum';
import { SuccessResponse } from 'src/shared/dtos/success-response.dto';
import { GetAdminsQueryDto } from './dto/admin-query.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { AdminLoginResponseDto } from './dto/admin-login-response.dto';
import { AdminResponseDto } from './dto/admin-response.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post(Routes.LOGIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(AdminLoginResponseDto)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.adminService.login(loginDto);
    return new SuccessResponse(ResponseMessages.LOGIN_SUCCESSFUL, result);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    await this.adminService.createAdmin(createAdminDto);
    return new SuccessResponse(ResponseMessages.USER_CREATED);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Serialize(AdminResponseDto)
  async getAllAdmins(@Query() queryData: GetAdminsQueryDto) {
    const response = await this.adminService.getAllAdmins(queryData);
    return new SuccessResponse(ResponseMessages.USERS_RETRIEVED, response);
  }
}
