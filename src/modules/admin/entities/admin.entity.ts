import { AuditLog } from 'src/modules/audit-logs/entities/audit-log.entity';
import { BaseEntity, UserRole } from 'src/shared';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('admins')
export class Admin extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STAFF })
  role: UserRole;

  @OneToMany(() => AuditLog, (auditLog) => auditLog.admin)
  auditLogs: AuditLog[];
}
