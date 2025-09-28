import { Column } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class AuditableEntity extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  createdIp: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  updatedIp: string;
}
