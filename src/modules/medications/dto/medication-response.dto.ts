import { Expose } from 'class-transformer';
import { MedicationType } from 'src/shared/enums/enum';
export class MedicationResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  weight: number;

  @Expose()
  code: string;

  @Expose()
  imageUrl: string;

  @Expose()
  type: MedicationType;

  @Expose()
  description: string;

  @Expose()
  isActive: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
