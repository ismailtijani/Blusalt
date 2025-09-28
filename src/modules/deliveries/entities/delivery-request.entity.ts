import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Drone } from '../../drones/entities/drone.entity';
import { BaseEntity, DeliveryPriority, DeliveryStatus } from 'src/shared';
import { DeliveryRequestItem } from './delivery-request-item.entity';

@Entity('delivery_requests')
@Index(['clientId', 'status'])
export class DeliveryRequest extends BaseEntity {
  @Column()
  clientId: string;

  @Column({ nullable: true })
  assignedDroneId: string;

  @Column()
  pickupAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  pickupLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  pickupLongitude: number;

  @Column()
  destinationAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  destinationLatitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  destinationLongitude: number;

  @Column({
    type: 'enum',
    enum: DeliveryPriority,
    default: DeliveryPriority.MEDIUM,
  })
  priority: DeliveryPriority;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column({ default: 0 })
  totalWeight: number;

  @Column({ nullable: true })
  estimatedDeliveryTime: Date;

  @Column({ nullable: true })
  actualDeliveryTime: Date;

  @Column({ nullable: true })
  assignedAt: Date;

  @Column({ nullable: true })
  pickupTime: Date;

  @Column({ nullable: true })
  specialInstructions: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  cancellationReason: string;

  // Relationships
  @ManyToOne(() => User, (user) => user.deliveryRequests)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => Drone, (drone) => drone.deliveryRequests, { nullable: true })
  @JoinColumn({ name: 'assigned_drone_id' })
  assignedDrone: Drone;

  @OneToMany(() => DeliveryRequestItem, (item) => item.deliveryRequest, {
    cascade: true,
  })
  items: DeliveryRequestItem[];

  // Virtual fields
  get pickupLocation() {
    return {
      latitude: this.pickupLatitude,
      longitude: this.pickupLongitude,
      address: this.pickupAddress,
    };
  }

  get destinationLocation() {
    return {
      latitude: this.destinationLatitude,
      longitude: this.destinationLongitude,
      address: this.destinationAddress,
    };
  }

  get isActive() {
    return ![DeliveryStatus.DELIVERED, DeliveryStatus.CANCELLED].includes(
      this.status,
    );
  }
}
