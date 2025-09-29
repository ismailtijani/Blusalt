import { Expose, Type } from 'class-transformer';

export class LoginResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  address: string;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;

  @Expose()
  phoneNumber: string;

  @Expose()
  organizationName: string;

  @Expose()
  role: string;

  @Expose()
  userType: string;

  @Expose()
  isVerified: boolean;

  @Expose()
  isActive: boolean;

  @Expose()
  @Type(() => Date)
  lastLoginAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
