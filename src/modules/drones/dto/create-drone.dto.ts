import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Max,
  Min,
  Length,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { DroneModel } from 'src/shared';

export class CreateDroneDto {
  @IsString()
  @Length(1, 100)
  serialNumber: string;

  @IsEnum(DroneModel)
  model: DroneModel;

  @Min(1)
  @Max(500)
  @Type(() => Number)
  @IsNumber()
  weightLimit: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  batteryCapacity: number;

  @IsOptional()
  @IsLatitude()
  baseLatitude: number;

  @IsOptional()
  @IsLongitude()
  baseLongitude: number;

  @IsOptional()
  @IsLatitude()
  currentLatitude: number;

  @IsOptional()
  @IsLongitude()
  currentLongitude: number;
}
