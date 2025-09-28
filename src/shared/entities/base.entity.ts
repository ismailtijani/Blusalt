import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';

/**
 * Base entity class that all domain entities should extend.
 * Provides common fields and functionality for all entities.
 */
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  isDeleted(): boolean {
    return this.deletedAt !== null && this.deletedAt !== undefined;
  }

  //   getTimeSinceLastUpdate(): number {
  //     return Date.now() - this.updatedAt.getTime();
  //   }
}
