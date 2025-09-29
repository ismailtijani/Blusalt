import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UserRole, UserType } from 'src/shared';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsNumberString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  organizationName: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @Type(() => Number)
  latitude: number;

  @IsOptional()
  @Type(() => Number)
  longitude: number;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsEnum(UserType)
  userType: UserType;
}
