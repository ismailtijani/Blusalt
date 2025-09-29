import { AuditLog } from 'src/modules/audit-logs/entities/audit-log.entity';
import { DeliveryRequest } from 'src/modules/deliveries/entities/delivery-request.entity';
import { BaseEntity, UserRole, UserType } from 'src/shared';
import { Entity, Column, OneToMany, Index } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 20 })
  firstName: string;

  @Column({ length: 20 })
  lastName: string;

  @Column({ length: 50, unique: true })
  @Index()
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserType, nullable: true })
  userType: UserType;

  @Column({ length: 255, nullable: true })
  organizationName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 500, nullable: true })
  refreshToken: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  // Relationships
  @OneToMany(() => DeliveryRequest, (deliveryRequest) => deliveryRequest.client)
  deliveryRequests: DeliveryRequest[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs: AuditLog[];

  // Virtual fields
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
