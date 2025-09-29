import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { UserRole, UserType } from 'src/shared';

export class GetUsersQueryDto {
  @IsOptional()
  @IsString()
  searchTerm: string;

  @IsOptional()
  @IsString()
  role: UserRole;

  @IsOptional()
  @IsString()
  userType: UserType;

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
