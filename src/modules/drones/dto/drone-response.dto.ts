import { Expose, Transform } from 'class-transformer';
import { DroneModel, DroneStatus } from 'src/shared';

export class DroneResponseDto {
  @Expose()
  id: string;

  @Expose()
  serialNumber: string;

  @Expose()
  model: DroneModel;

  @Expose()
  weightLimit: number;

  @Expose()
  batteryCapacity: number;

  @Expose()
  status: DroneStatus;

  @Expose()
  currentLoadWeight: number;

  @Expose()
  @Transform(({ obj }) => ({
    latitude: obj.currentLatitude,
    longitude: obj.currentLongitude,
  }))
  currentLocation: { latitude?: number; longitude?: number };

  @Expose()
  @Transform(({ obj }) => ({
    latitude: obj.baseLatitude,
    longitude: obj.baseLongitude,
  }))
  baseLocation: { latitude: number; longitude: number };

  @Expose()
  @Transform(({ obj }) => obj.weightLimit - obj.currentLoadWeight)
  availableCapacity: number;

  @Expose()
  totalFlightTime: number;

  @Expose()
  lastMaintenanceDate: Date;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
