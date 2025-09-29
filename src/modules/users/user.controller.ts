import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Routes } from 'src/shared/enums/routes.enum';
import { CreateUserDto } from './dto/create-user.dto';
import {
  AuthGuard,
  ResponseMessages,
  Serialize,
  SuccessResponse,
} from 'src/shared';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(Routes.CREATE_USER)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(UserResponseDto)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return new SuccessResponse(ResponseMessages.USER_CREATED, user);
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
  ) {
    const user = await this.userService.updateUser(id, updateUserDto);
    return new SuccessResponse(ResponseMessages.USER_UPDATED, user);
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

  // @Put(':userId/activate')
  // @HttpCode(HttpStatus.OK)
  // async activateUser(@Param('userId') userId: string, @Request() req: Request) {
  //   const user = await this.userService.toggleUserStatus(
  //     userId,
  //     true,
  //     req.user?.id,
  //   );
  //   return new SuccessResponse('User activated successfully', user);
  // }

  // @Put(':userId/deactivate')
  // @HttpCode(HttpStatus.OK)
  // async deactivateUser(
  //   @Param('userId') userId: string,
  //   @Request() req: Request,
  // ) {
  //   const user = await this.userService.toggleUserStatus(
  //     userId,
  //     false,
  //     req.user?.id,
  //   );
  //   return new SuccessResponse('User deactivated successfully', user);
  // }

  // @Delete(Routes.DELETE_USER)
  // @HttpCode(HttpStatus.OK)
  // async deleteUser(@Param('userId') userId: string, @Request() req) {
  //   await this.userService.deleteUser(userId, req.user?.id);
  //   return new SuccessResponse(ResponseMessages.USER_DELETED);
  // }
}
