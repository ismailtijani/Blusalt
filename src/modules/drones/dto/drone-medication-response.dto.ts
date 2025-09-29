import { Expose, Type } from 'class-transformer';
class MedicationResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  code: string;

  @Expose()
  weight: number;

  @Expose()
  type: string;

  @Expose()
  imageUrl: string;
}

export class DroneMedicationResponseDto {
  @Expose()
  @Type(() => MedicationResponseDto)
  medication: MedicationResponseDto;

  @Expose()
  quantity: number;

  @Expose()
  totalWeight: number;

  @Expose()
  loadedAt: Date;

  @Expose()
  isDelivered: boolean;
}
