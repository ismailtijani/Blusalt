import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Patch,
  Req,
} from '@nestjs/common';
import { DroneService } from './drone.service';
import {
  AuthGuard,
  CurrentUser,
  GetIpAddress,
  GetUser,
  GetUserAgent,
  PaginationDto,
  ResponseMessages,
  Routes,
  Serialize,
  SuccessResponse,
} from 'src/shared';
import { DroneResponseDto } from './dto/drone-response.dto';
import { CreateDroneDto } from './dto/create-drone.dto';
import { LoadDroneDto } from './dto/load-drone.dto';
import { DroneMedicationResponseDto } from './dto/drone-medication-response.dto';
import { BatteryCheckResponseDto } from './dto/battery-check-response.dto';
import { UpdateDroneLocationDto } from './dto/update-drone-location.dto';
import { UpdateDroneDto } from './dto/update-drone.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('drones')
export class DroneController {
  constructor(
    private readonly droneService: DroneService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post(Routes.REGISTER_DRONE)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(DroneResponseDto)
  async registerDrone(
    @Body() createDroneDto: CreateDroneDto,
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    const drone = await this.droneService.registerDrone(createDroneDto);

    // Emit activity log
    this.eventEmitter.emit('onUserActivity', {
      action: createDroneDto,
      description: 'Register New Drone',
      feedback: drone,
      identity: user.email,
      maskedAction: false,
      maskedFeedback: false,
      what: req.originalUrl,
      when: new Date().toISOString(),
      owner: user.sub,
      ipAddress,
      userAgent,
    });
    return new SuccessResponse(ResponseMessages.DRONE_REGISTERED, drone);
  }

  @Get(Routes.GET_DRONES)
  @HttpCode(HttpStatus.OK)
  @Serialize(DroneResponseDto)
  async getDrones(@Query() paginationDto: PaginationDto) {
    const result = await this.droneService.findAll(paginationDto);
    return new SuccessResponse(ResponseMessages.DRONES_RETRIEVED, result);
  }

  @Get(Routes.GET_AVAILABLE_DRONES)
  @HttpCode(HttpStatus.OK)
  @Serialize(DroneResponseDto)
  async getAvailableDrones() {
    const drones = await this.droneService.getAvailableDrones();
    return new SuccessResponse(
      ResponseMessages.AVAILABLE_DRONES_RETRIEVED,
      drones,
    );
  }

  @Get(Routes.GET_ONE_DRONE)
  @HttpCode(HttpStatus.OK)
  @Serialize(DroneResponseDto)
  async getDrone(@Param('droneId') droneId: string) {
    const drone = await this.droneService.findById(droneId);
    return new SuccessResponse(ResponseMessages.DRONE_RETRIEVED, drone);
  }

  @Patch(Routes.UPDATE_DRONE)
  @HttpCode(HttpStatus.OK)
  @Serialize(DroneResponseDto)
  async updateDrone(
    @Param('droneId') droneId: string,
    @Body() updateDroneDto: UpdateDroneDto,
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    const drone = await this.droneService.update(droneId, updateDroneDto);

    // Emit activity log
    this.eventEmitter.emit('onUserActivity', {
      action: updateDroneDto,
      description: `Update Drone ${drone.serialNumber}`,
      feedback: drone,
      identity: user.email,
      maskedAction: false,
      maskedFeedback: false,
      what: req.originalUrl,
      when: new Date().toISOString(),
      owner: user.sub,
      ipAddress,
      userAgent,
    });
    return new SuccessResponse(ResponseMessages.DRONE_UPDATED, drone);
  }

  @Delete(Routes.DELETE_DRONE)
  @HttpCode(HttpStatus.OK)
  async deleteDrone(
    @Param('droneId') droneId: string,
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    await this.droneService.delete(droneId);

    this.eventEmitter.emit('onUserActivity', {
      action: { droneId },
      description: `Delete Drone`,
      feedback: { deleted: true },
      identity: user.email,
      maskedAction: false,
      maskedFeedback: false,
      what: req.originalUrl,
      when: new Date().toISOString(),
      owner: user.sub,
      ipAddress,
      userAgent,
    });
    return new SuccessResponse(ResponseMessages.DRONE_DELETED);
  }

  @Post(Routes.LOAD_DRONE)
  @HttpCode(HttpStatus.OK)
  @Serialize(DroneResponseDto)
  async loadDrone(
    @Param('droneId') droneId: string,
    @Body() loadDroneDto: LoadDroneDto,
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    const drone = await this.droneService.loadDrone(droneId, loadDroneDto);

    this.eventEmitter.emit('onUserActivity', {
      action: loadDroneDto,
      description: `Load Drone with Medications`,
      feedback: {
        droneId: drone.id,
        serialNumber: drone.serialNumber,
        totalWeight: drone.currentLoadWeight,
        itemCount: loadDroneDto.items.length,
      },
      identity: user.email,
      maskedAction: false,
      maskedFeedback: false,
      what: req.originalUrl,
      when: new Date().toISOString(),
      owner: user.sub,
      ipAddress,
      userAgent,
    });
    return new SuccessResponse(ResponseMessages.DRONE_LOADED, drone);
  }

  @Get(Routes.GET_DRONE_MEDICATIONS)
  @HttpCode(HttpStatus.OK)
  @Serialize(DroneMedicationResponseDto)
  async getDroneMedications(@Param('droneId') droneId: string) {
    const medications = await this.droneService.getDroneMedications(droneId);
    return new SuccessResponse(
      ResponseMessages.MEDICATIONS_RETRIEVED,
      medications,
    );
  }

  @Get(Routes.CHECK_DRONE_BATTERY)
  @HttpCode(HttpStatus.OK)
  @Serialize(BatteryCheckResponseDto)
  async checkDroneBattery(@Param('droneId') droneId: string) {
    const batteryInfo = await this.droneService.checkDroneBattery(droneId);
    return new SuccessResponse(
      ResponseMessages.DRONE_BATTERY_CHECKED,
      batteryInfo,
    );
  }

  @Patch(Routes.UPDATE_DRONE_LOCATION)
  @HttpCode(HttpStatus.OK)
  @Serialize(DroneResponseDto)
  async updateDroneLocation(
    @Param('droneId') droneId: string,
    @Body() locationDto: UpdateDroneLocationDto,
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    const drone = await this.droneService.updateDroneLocation(
      droneId,
      locationDto,
    );

    this.eventEmitter.emit('onUserActivity', {
      action: locationDto,
      description: `Update Drone Location`,
      feedback: {
        droneId: drone.id,
        serialNumber: drone.serialNumber,
        latitude: drone.currentLatitude,
        longitude: drone.currentLongitude,
      },
      identity: user.email,
      maskedAction: false,
      maskedFeedback: false,
      what: req.originalUrl,
      when: new Date().toISOString(),
      owner: user.sub,
      ipAddress,
      userAgent,
    });
    return new SuccessResponse(ResponseMessages.DRONE_UPDATED, drone);
  }
}
