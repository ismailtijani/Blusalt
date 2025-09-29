import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AppConfig } from 'src/config';

@Injectable()
export class HelperService {
  constructor(private readonly configService: ConfigService) {}

  async hashData(data: string) {
    console.log(AppConfig(this.configService).BCRYPT_SALT_ROUNDS);
    return await bcrypt.hash(
      data,
      AppConfig(this.configService).BCRYPT_SALT_ROUNDS,
    );
  }

  async compareHashedData(data: string, hash: string) {
    return bcrypt.compare(data, hash);
  }

  generateOTP() {
    try {
      const bytes = crypto.randomBytes(3);
      return ((bytes.readUIntBE(0, 3) % 900000) + 100000).toString();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error Generating OTP');
    }
  }

  static calculatePercentage(value: number, percentage: number): number {
    return (value * percentage) / 100;
  }
}
