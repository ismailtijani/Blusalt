import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Drone } from '../../drones/entities/drone.entity';
import { AuditAction, BaseEntity } from 'src/shared';

@Entity('audit_logs')
@Index(['action', 'entityType', 'ipAddress', 'timestamp'])
export class AuditLog extends BaseEntity {
  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column()
  entityType: string; // 'User', 'Drone', 'Medication', 'DeliveryRequest'

  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  droneId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  oldValues: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  newValues: Record<string, any>;

  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column()
  timestamp: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.auditLogs, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Drone, (drone) => drone.auditLogs, { nullable: true })
  @JoinColumn({ name: 'drone_id' })
  drone: Drone;
}
