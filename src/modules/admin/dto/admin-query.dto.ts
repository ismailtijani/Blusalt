import { Transform } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { UserRole } from 'src/shared';

export class GetAdminsQueryDto {
  @IsOptional()
  @IsString()
  searchTerm: string;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

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
}
