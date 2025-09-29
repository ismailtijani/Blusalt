import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Drone } from 'src/modules/drones/entities/drone.entity';
import { Medication } from 'src/modules/medications/entities/medication.entity';

@Entity('drone_medications')
@Index(['drone', 'medication'], { unique: true })
export class DroneMedication extends BaseEntity {
  @Column()
  droneId: string;

  @Column()
  medicationId: string;

  @Column()
  quantity: number;

  @Column('float')
  totalWeight: number;

  @Column()
  loadedAt: Date;

  @Column({ default: false })
  isDelivered: boolean;

  // Relationships
  @ManyToOne(() => Drone, (drone) => drone.droneMedications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'droneId' })
  drone: Drone;

  @ManyToOne(() => Medication, (medication) => medication.droneMedications)
  @JoinColumn({ name: 'medicationId' })
  medication: Medication;
}
