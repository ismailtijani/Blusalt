import { IsString, IsUUID, IsNumber, Min } from 'class-validator';

export class LoadDroneItemDto {
  @IsString()
  @IsUUID()
  medicationId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
