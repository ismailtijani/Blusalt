import { Transform } from 'class-transformer';
import {
  IsBooleanString,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class MedicationQueryDto {
  @IsOptional()
  @IsString()
  searchTerm: string;

  @IsOptional()
  @IsBooleanString()
  isActive: boolean;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @Min(1)
  page: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @Min(1)
  @Max(100)
  limit: number;
  ng;
}
