import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUrl,
  Min,
  Length,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { MedicationType } from 'src/shared/enums/enum';

export class CreateMedicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0.1)
  weight: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  code: string;

  @IsOptional()
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsEnum(MedicationType)
  type: MedicationType;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
  })
  isActive: boolean;
}
