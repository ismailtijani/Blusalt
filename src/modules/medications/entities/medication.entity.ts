import { DeliveryRequestItem } from 'src/modules/deliveries/entities/delivery-request-item.entity';
import { BaseEntity, MedicationType } from 'src/shared';
import { DroneMedication } from 'src/shared/entities/drone-medication.entity';
import { Entity, Column, Index, OneToMany } from 'typeorm';

@Entity('medications')
export class Medication extends BaseEntity {
  @Column()
  name: string;

  @Column()
  weight: number; // in grams

  @Column({ unique: true })
  @Index()
  code: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: MedicationType,
    default: MedicationType.MEDICATION,
  })
  type: MedicationType;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  manufacturer: string;

  // Relationships
  @OneToMany(
    () => DroneMedication,
    (droneMedication) => droneMedication.medication,
  )
  droneMedications: DroneMedication[];

  @OneToMany(
    () => DeliveryRequestItem,
    (deliveryRequestItem) => deliveryRequestItem.medication,
  )
  deliveryRequestItems: DeliveryRequestItem[];
}
