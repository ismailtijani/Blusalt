import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from 'src/shared';

@Entity('audit_logs')
@Index(['owner', 'when'])
@Index(['action', 'when'])
export class AuditLog extends BaseEntity {
  // Type of action performed (e.g., 'CREATE_DRONE', 'LOAD_MEDICATION', 'LOGIN')
  @Column({ type: 'varchar', length: 100 })
  @Index()
  action: string;

  // Human-readable description of what happened
  @Column({ type: 'text' })
  description: string;

  /**
   * Input data/payload that triggered the action
   * Stored as JSON for flexibility
   */
  @Column({ type: 'jsonb', nullable: true })
  actionData: Record<string, any>;

  /**
   * Response/result of the action
   * Stored as JSON for flexibility
   */
  @Column({ type: 'jsonb', nullable: true })
  feedback: Record<string, any>;

  /**
   * User identifier (email, username, or user ID)
   */
  @Column()
  identity: string;

  // Whether action data contains sensitive information
  @Column({ type: 'boolean', default: false })
  maskedAction: boolean;

  // Whether feedback contains sensitive information
  @Column({ type: 'boolean', default: false })
  maskedFeedback: boolean;

  // API endpoint or operation path
  @Column()
  what: string;

  // Timestamp when action occurred
  @Column()
  @Index()
  when: Date;

  // User ID who performed the action
  @Column()
  @Index()
  owner: string;

  // IP address of the requester
  @Column({ nullable: true })
  ipAddress: string;

  // User agent string
  @Column({ nullable: true })
  userAgent: string;
}
