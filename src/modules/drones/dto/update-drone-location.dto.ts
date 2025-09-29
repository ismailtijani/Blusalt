import { IsLatitude, IsLongitude } from 'class-validator';

export class UpdateDroneLocationDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}
