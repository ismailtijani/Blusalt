import { ConfigService } from '@nestjs/config';

export const AppConfig = (configService: ConfigService) => ({
  PORT: configService.get<number>('PORT', 8080),
  JWT_SECRET: configService.get<string>('JWT_SECRET', 'your-secret-key'),
  JWT_EXPIRES_IN: configService.get<string>('JWT_EXPIRES_IN', '1h'),
  JWT_REFRESH_SECRET: configService.get<string>(
    'JWT_REFRESH_SECRET',
    'your-refresh-secret',
  ),
  JWT_REFRESH_EXPIRES_IN: configService.get<string>(
    'JWT_REFRESH_EXPIRES_IN',
    '7d',
  ),
  BCRYPT_SALT_ROUNDS: Number(configService.get('BCRYPT_ROUNDS', 6)),
  CORS_ORIGIN: configService.get<string>(
    'CORS_ORIGIN',
    'http://localhost:3000',
  ),
});
