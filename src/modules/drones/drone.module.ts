import { Module } from '@nestjs/common';
import { DroneService } from './drone.service';
import { DroneController } from './drone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drone } from './entities/drone.entity';
import { DroneMedication } from 'src/shared/entities/drone-medication.entity';
import { Medication } from '../medications/entities/medication.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Drone, DroneMedication, Medication])],
  controllers: [DroneController],
  providers: [DroneService, JwtService],
})
export class DroneModule {}
