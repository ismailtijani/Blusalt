import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig, DatabaseConfig } from './config';
import { DeliveryRequestModule } from './modules/deliveries/delivery-request.module';
import { AuditLogModule } from './modules/audit-logs/audit-log.module';
import { UserModule } from './modules/users/user.module';
import { DroneModule } from './modules/drones/drone.module';
import { MedicationModule } from './modules/medications/medication.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: AppConfig(configService).JWT_SECRET,
        signOptions: { expiresIn: AppConfig(configService).JWT_EXPIRES_IN },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: DatabaseConfig,
    }),
    UserModule,
    DroneModule,
    MedicationModule,
    DeliveryRequestModule,
    AuditLogModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
