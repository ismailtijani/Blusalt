import { ConfigService } from '@nestjs/config';

export const AppConfig = (configService: ConfigService) => ({
  port: configService.get<number>('PORT', 8080),
  jwtSecret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
  jwtExpiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
  jwtRefreshSecret: configService.get<string>(
    'JWT_REFRESH_SECRET',
    'your-refresh-secret',
  ),
  jwtRefreshExpiresIn: configService.get<string>(
    'JWT_REFRESH_EXPIRES_IN',
    '7d',
  ),
  bcryptRounds: configService.get<number>('BCRYPT_ROUNDS', 12),
  corsOrigin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3000'),
});
