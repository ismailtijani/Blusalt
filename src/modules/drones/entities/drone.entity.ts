import { AuditLog } from 'src/modules/audit-logs/entities/audit-log.entity';
import { DeliveryRequest } from 'src/modules/deliveries/entities/delivery-request.entity';
import { BaseEntity, DroneModel, DroneStatus } from 'src/shared';
import { DroneMedication } from 'src/shared/entities/drone-medication.entity';
import { Entity, Column, OneToMany, Index } from 'typeorm';

@Entity('drones')
export class Drone extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  serialNumber: string;

  @Column({
    type: 'enum',
    enum: DroneModel,
    default: DroneModel.MIDDLEWEIGHT,
  })
  model: DroneModel;

  @Column('float')
  weightLimit: number; // in grams, max 500

  @Column({ type: 'decimal', default: 100 })
  batteryCapacity: number; // percentage

  @Column({
    type: 'enum',
    enum: DroneStatus,
    default: DroneStatus.IDLE,
  })
  @Index()
  status: DroneStatus;

  @Column({ type: 'float', nullable: true })
  currentLatitude: number;

  @Column({ type: 'float', nullable: true })
  currentLongitude: number;

  @Column({ type: 'float', default: 0 })
  currentLoadWeight: number;

  @Column({ type: 'float', default: 0 })
  baseLatitude: number;

  @Column({ type: 'float', default: 0 })
  baseLongitude: number;

  @Column({ nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'float', default: 0 })
  totalFlightTime: number; // in minutes

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLocationUpdate: Date;

  // Relationships
  @OneToMany(
    () => DeliveryRequest,
    (deliveryRequest) => deliveryRequest.assignedDrone,
  )
  deliveryRequests: DeliveryRequest[];

  @OneToMany(() => DroneMedication, (droneMedication) => droneMedication.drone)
  droneMedications: DroneMedication[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.drone)
  auditLogs: AuditLog[];

  // Virtual fields
  get availableCapacity(): number {
    return this.weightLimit - this.currentLoadWeight;
  }

  get isAvailableForLoading() {
    return (
      this.status === DroneStatus.IDLE &&
      this.batteryCapacity >= 25 &&
      this.isActive
    );
  }

  get currentLocation() {
    return { latitude: this.currentLatitude, longitude: this.currentLongitude };
  }

  get baseLocation() {
    return { latitude: this.baseLatitude, longitude: this.baseLongitude };
  }
}
