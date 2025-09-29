import { Expose } from 'class-transformer';

export class BatteryCheckResponseDto {
  @Expose()
  droneId: string;

  @Expose()
  serialNumber: string;

  @Expose()
  batteryCapacity: number;

  @Expose()
  isLowBattery: boolean;

  @Expose()
  canLoad: boolean;
}
