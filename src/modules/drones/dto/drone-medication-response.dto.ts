import { Expose } from 'class-transformer';

export class DroneMedicationResponseDto {
  @Expose()
  medication: {
    id: string;
    name: string;
    code: string;
    weight: number;
    type: string;
    imageUrl?: string;
  };

  @Expose()
  quantity: number;

  @Expose()
  totalWeight: number;

  @Expose()
  loadedAt: Date;
}
