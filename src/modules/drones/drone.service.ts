import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drone } from './entities/drone.entity';
import { Medication } from '../medications/entities/medication.entity';
import { DroneMedication } from 'src/shared/entities/drone-medication.entity';
import {
  BaseService,
  DRONE_WEIGHT_LIMITS,
  DroneStatus,
  ErrorMessages,
  LoadItem,
  MIN_BATTERY_LEVEL_FOR_LOADING,
  VALID_STATE_TRANSITIONS,
} from 'src/shared';
import { CreateDroneDto } from './dto/create-drone.dto';
import { LoadDroneDto } from './dto/load-drone.dto';
import { UpdateDroneLocationDto } from './dto/update-drone-location.dto';

@Injectable()
export class DroneService extends BaseService<Drone> {
  constructor(
    @InjectRepository(Drone)
    droneRepository: Repository<Drone>,
    @InjectRepository(DroneMedication)
    private readonly droneMedicationRepository: Repository<DroneMedication>,
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
    // private readonly auditLogService: AuditLogService,
  ) {
    super(droneRepository);
  }

  async registerDrone(createDroneDto: CreateDroneDto): Promise<Drone> {
    const existingDrone = await this.existsByField(
      'serialNumber',
      createDroneDto.serialNumber,
    );
    if (existingDrone) {
      throw new BadRequestException(ErrorMessages.DRONE_ALREADY_EXISTS);
    }

    const maxWeightForModel = DRONE_WEIGHT_LIMITS[createDroneDto.model];
    if (createDroneDto.weightLimit > maxWeightForModel) {
      throw new BadRequestException(
        `${createDroneDto.model} drone cannot have weight limit exceeding ${maxWeightForModel}g`,
      );
    }

    const drone = await this.create(createDroneDto);

    // await this.auditLogService.log({
    //   action: 'CREATE',
    //   entityType: 'Drone',
    //   entityId: drone.id,
    //   description: `Drone ${drone.serialNumber} registered`,
    // });

    return drone;
  }

  async loadDrone(
    droneId: string,
    loadDroneDto: LoadDroneDto,
    // userId?: string,
  ): Promise<Drone> {
    const drone = await this.findById(droneId, [
      'droneMedications',
      'droneMedications.medication',
    ]);

    // Validate drone can be loaded
    this.validateDroneForLoading(drone);

    // Calculate total weight and validate
    let totalWeight = drone.currentLoadWeight;
    const loadItems: LoadItem[] = [];

    for (const item of loadDroneDto.items) {
      const medication = await this.medicationRepository.findOne({
        where: { id: item.medicationId },
      });

      if (!medication) {
        throw new NotFoundException(
          `Medication with ID ${item.medicationId} not found`,
        );
      }

      const itemWeight = medication.weight * item.quantity;
      totalWeight += itemWeight;

      if (totalWeight > drone.weightLimit) {
        throw new BadRequestException(ErrorMessages.DRONE_OVERLOAD);
      }

      loadItems.push({
        medication,
        quantity: item.quantity,
        weight: itemWeight,
      });
    }

    await this.updateDroneState(drone, DroneStatus.LOADING);
    // await this.updateDroneState(drone, DroneStatus.LOADING, userId);

    // Create drone-medication associations
    for (const item of loadItems) {
      await this.droneMedicationRepository.save({
        droneId: drone.id,
        medicationId: item.medication.id,
        quantity: item.quantity,
        totalWeight: item.weight,
        isDelivered: false,
        loadedAt: new Date(),
      });
    }
    // Update drone weight and state
    await this.repository.update(drone.id, {
      currentLoadWeight: totalWeight,
      status: DroneStatus.LOADED,
    });

    // await this.auditLogService.log({
    //   action: 'DRONE_LOAD',
    //   entityType: 'Drone',
    //   entityId: drone.id,
    //   userId,
    //   description: `Drone ${drone.serialNumber} loaded with ${loadDroneDto.items.length} medication types`,
    //   newValues: { totalWeight, itemCount: loadDroneDto.items.length },
    // });

    const loadedDrone = await this.findById(droneId, [
      'droneMedications',
      'droneMedications.medication',
    ]);
    return loadedDrone;
  }

  async getDroneMedications(droneId: string) {
    await this.findById(droneId);

    const medications = await this.droneMedicationRepository.find({
      where: {
        droneId: droneId,
        isDelivered: false,
      },
      relations: ['medication'],
    });

    return medications.map((dm) => ({
      medication: {
        id: dm.medication.id,
        name: dm.medication.name,
        code: dm.medication.code,
        weight: dm.medication.weight,
        type: dm.medication.type,
        imageUrl: dm.medication.imageUrl,
      },
      quantity: dm.quantity,
      totalWeight: dm.totalWeight,
      loadedAt: dm.loadedAt,
    }));
  }

  async getAvailableDrones() {
    return await this.repository.find({
      where: {
        status: DroneStatus.IDLE,
        isActive: true,
      },
      select: [
        'id',
        'serialNumber',
        'model',
        'weightLimit',
        'batteryCapacity',
        'status',
        'currentLoadWeight',
        'currentLatitude',
        'currentLongitude',
      ],
    });
  }

  async checkDroneBattery(droneId: string) {
    const drone = await this.findById(droneId);

    // await this.auditLogService.log({
    //   action: 'BATTERY_CHECK',
    //   entityType: 'Drone',
    //   entityId: drone.id,
    //   userId,
    //   description: `Battery level checked: ${drone.batteryCapacity}%`,
    //   newValues: { batteryLevel: drone.batteryCapacity },
    // });

    return {
      droneId: drone.id,
      serialNumber: drone.serialNumber,
      batteryCapacity: drone.batteryCapacity,
      isLowBattery: drone.batteryCapacity < MIN_BATTERY_LEVEL_FOR_LOADING,
      canLoad:
        drone.batteryCapacity >= MIN_BATTERY_LEVEL_FOR_LOADING &&
        drone.status === DroneStatus.IDLE,
    };
  }

  async updateDroneLocation(
    droneId: string,
    locationDto: UpdateDroneLocationDto,
    // userId?: string,
  ): Promise<Drone> {
    await this.findById(droneId);

    await this.repository.update(droneId, {
      currentLatitude: locationDto.latitude,
      currentLongitude: locationDto.longitude,
      lastLocationUpdate: new Date(),
    });

    // await this.auditLogService.log({
    //   action: 'LOCATION_UPDATE',
    //   entityType: 'Drone',
    //   entityId: drone.id,
    //   userId,
    //   description: `Location updated for drone ${drone.serialNumber}`,
    //   newValues: {
    //     latitude: locationDto.latitude,
    //     longitude: locationDto.longitude,
    //   },
    // });

    return await this.findById(droneId);
  }

  async updateDroneState(
    drone: Drone,
    newStatus: DroneStatus,
    // userId?: string,
  ): Promise<void> {
    const validTransitions = VALID_STATE_TRANSITIONS[drone.status];

    if (!validTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${drone.status} to ${newStatus}`,
      );
    }

    if (
      newStatus === DroneStatus.LOADING &&
      drone.batteryCapacity < MIN_BATTERY_LEVEL_FOR_LOADING
    ) {
      throw new BadRequestException(ErrorMessages.DRONE_LOW_BATTERY);
    }

    // const oldStatus = drone.status;
    await this.repository.update(drone.id, { status: newStatus });

    // await this.auditLogService.log({
    //   action: 'DRONE_STATUS_CHANGE',
    //   entityType: 'Drone',
    //   entityId: drone.id,
    //   userId,
    //   description: `Drone ${drone.serialNumber} status changed from ${oldStatus} to ${newStatus}`,
    //   oldValues: { status: oldStatus },
    //   newValues: { status: newStatus },
    // });
  }

  async findNearestAvailableDrone(
    pickupLatitude: number,
    pickupLongitude: number,
    requiredCapacity: number,
  ): Promise<Drone | null> {
    const availableDrones = await this.repository
      .createQueryBuilder('drone')
      .where('drone.status = :status', { status: DroneStatus.IDLE })
      .andWhere('drone.batteryCapacity >= :minBattery', {
        minBattery: MIN_BATTERY_LEVEL_FOR_LOADING,
      })
      .andWhere('drone.isActive = :isActive', { isActive: true })
      .andWhere('(drone.weightLimit - drone.currentLoadWeight) >= :capacity', {
        capacity: requiredCapacity,
      })
      .getMany();

    if (availableDrones.length === 0) {
      return null;
    }

    // Calculate distances and return nearest drone
    let nearestDrone = availableDrones[0];
    let minDistance = this.calculateDistance(
      pickupLatitude,
      pickupLongitude,
      nearestDrone.currentLatitude || nearestDrone.baseLatitude,
      nearestDrone.currentLongitude || nearestDrone.baseLongitude,
    );

    for (const drone of availableDrones.slice(1)) {
      const distance = this.calculateDistance(
        pickupLatitude,
        pickupLongitude,
        drone.currentLatitude || drone.baseLatitude,
        drone.currentLongitude || drone.baseLongitude,
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestDrone = drone;
      }
    }

    return nearestDrone;
  }

  // Calculate distance between two points using Haversine formula
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Validate if drone can be loaded
  private validateDroneForLoading(drone: Drone): void {
    if (drone.status !== DroneStatus.IDLE) {
      throw new BadRequestException(
        `Drone is not available for loading. Current status: ${drone.status}`,
      );
    }

    if (drone.batteryCapacity < MIN_BATTERY_LEVEL_FOR_LOADING) {
      throw new BadRequestException(ErrorMessages.DRONE_LOW_BATTERY);
    }

    if (!drone.isActive) {
      throw new BadRequestException(ErrorMessages.DRONE_INACTIVE);
    }
  }

  // Override base service methods
  protected getCreateErrorMessage(): string {
    return ErrorMessages.DRONE_CREATE_FAILED;
  }

  protected getUpdateErrorMessage(): string {
    return ErrorMessages.DRONE_UPDATE_FAILED;
  }

  protected getDeleteErrorMessage(): string {
    return ErrorMessages.DRONE_DELETE_FAILED;
  }

  protected getNotFoundErrorMessage(): string {
    return ErrorMessages.DRONE_NOT_FOUND;
  }
}
