// import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';

// export const getDatabaseConfig = (
//   configService: ConfigService,
// ): TypeOrmModuleOptions => ({
//   type: 'postgres',
//   host: configService.get<string>('DB_HOST', 'localhost'),
//   port: configService.get<number>('DB_PORT', 5432),
//   username: configService.get<string>('DB_USERNAME', 'postgres'),
//   password: configService.get<string>('DB_PASSWORD', 'password'),
//   database: configService.get<string>('DB_NAME', 'drone_logistics'),
//   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//   migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
//   synchronize: configService.get('NODE_ENV') === 'development',
//   logging: configService.get('NODE_ENV') === 'development',
//   ssl:
//     configService.get('NODE_ENV') === 'production'
//       ? { rejectUnauthorized: false }
//       : false,
// });
