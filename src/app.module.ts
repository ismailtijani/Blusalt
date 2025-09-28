import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config';
import { DeliveryRequestModule } from './modules/deliveries/delivery-request.module';
import { AuditLogModule } from './modules/audit-logs/audit-log.module';
import { UserModule } from './modules/users/user.module';
import { DroneModule } from './modules/drones/drone.module';
import { MedicationModule } from './modules/medications/medication.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
