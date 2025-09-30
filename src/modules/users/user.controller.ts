import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Routes } from 'src/shared/enums/routes.enum';
import { CreateUserDto } from './dto/create-user.dto';
import {
  AuthGuard,
  CurrentUser,
  GetIpAddress,
  GetUser,
  GetUserAgent,
  Public,
  ResponseMessages,
  Serialize,
  SuccessResponse,
} from 'src/shared';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post(Routes.CREATE_USER)
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    const response = await this.userService.createUser(createUserDto);

    // Emit activity log
    this.eventEmitter.emit('onUserActivity', {
      action: createUserDto,
      description: 'User Creation',
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

  @Get(Routes.GET_USERS)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserResponseDto)
  async getAllUsers(@Query() queryData: GetUsersQueryDto) {
    const response = await this.userService.getUsers(queryData);
    return new SuccessResponse(ResponseMessages.USERS_RETRIEVED, response);
  }

  @Get(Routes.GET_ONE_USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserResponseDto)
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.userService.findById(id);
    return new SuccessResponse(ResponseMessages.USER_RETRIEVED, user);
  }

  @Patch(Routes.UPDATE_USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(UserResponseDto)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    const response = await this.userService.updateUser(id, updateUserDto);

    this.eventEmitter.emit('onUserActivity', {
      action: updateUserDto,
      description: 'User Update',
      feedback: response,
      identity: user.email,
      maskedAction: false,
      maskedFeedback: false,
      what: req.originalUrl,
      when: new Date().toISOString(),
      owner: user.sub,
      ipAddress,
      userAgent,
    });
    return new SuccessResponse(ResponseMessages.USER_UPDATED, response);
  }

  @Get('clients')
  @HttpCode(HttpStatus.OK)
  async getClientUsers() {
    const clients = await this.userService.getClientUsers();
    return new SuccessResponse('Client users retrieved successfully', clients);
  }

  @Get('staff')
  @HttpCode(HttpStatus.OK)
  async getStaffUsers() {
    const staff = await this.userService.getStaffUsers();
    return new SuccessResponse('Staff users retrieved successfully', staff);
  }

  @Get('stats/role')
  @HttpCode(HttpStatus.OK)
  async getUserStatsByRole() {
    const stats = await this.userService.getUserStatsByRole();
    return new SuccessResponse('User statistics by role retrieved', stats);
  }

  @Get('stats/type')
  @HttpCode(HttpStatus.OK)
  async getUserStatsByType() {
    const stats = await this.userService.getUserStatsByType();
    return new SuccessResponse('User statistics by type retrieved', stats);
  }

  @Get('recent')
  @HttpCode(HttpStatus.OK)
  async getRecentUsers(@Query('days') days?: string) {
    const dayCount = days ? parseInt(days) : 7;
    const users = await this.userService.getRecentUsers(dayCount);
    return new SuccessResponse('Recent users retrieved successfully', users);
  }
}
