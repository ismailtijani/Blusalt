import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { ErrorMessages } from '../enums/error-messages.enum';
import { PaginationDto } from '../dtos/pagination.dto';
import { PaginatedResult, PaginationMeta } from '../interfaces/interface';

@Injectable()
export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  /**
   * Creates a new record in the database.
   * @param data - Data to create the record (matches entity schema).
   * @returns Promise resolving to the created record.
   * @throws BadRequestException if creation fails.
   */
  async create(data: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (error) {
      console.error('Create operation failed:', error);
      throw new BadRequestException(this.getCreateErrorMessage());
    }
  }

  /**
   * Find a record by ID, optionally fetching related data
   * @param id - The ID of the record
   * @param relations - Optional array of relation names to fetch
   * @returns Promise<T>
   * @throws NotFoundException if the record is not found
   * @throws BadRequestException if invalid relations are provided
   */
  async findById(id: string, relations?: string[]): Promise<T> {
    try {
      const options: FindManyOptions<T> = {
        where: { id } as FindOptionsWhere<T>,
        relations: relations || [],
      };

      const record = await this.repository.findOne(options);

      if (!record) {
        throw new NotFoundException(this.getNotFoundErrorMessage());
      }

      return record;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('FindById operation failed:', error);
      throw new BadRequestException(ErrorMessages.DATABASE_ERROR);
    }
  }

  /**
   * Fetch paginated records with optional filters and relations
   * @param paginationDto - Pagination parameters (page, limit)
   * @param relations - Optional array of relation names to fetch
   * @param filters - Optional key-value pairs for filtering
   * @returns Promise<PaginatedResult<T>>
   * @throws BadRequestException if query execution fails
   */
  async findAll(
    paginationDto: PaginationDto,
    relations?: string[],
    filters?: Record<string, any>,
  ): Promise<PaginatedResult<T>> {
    try {
      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;

      const options: FindManyOptions<T> = {
        skip,
        take: limit,
        relations: relations || [],
        where: filters as FindOptionsWhere<T>,
      };

      const [data, total] = await this.repository.findAndCount(options);

      const meta: PaginationMeta = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        // hasNext: page < Math.ceil(total / limit),
        hasNext: total > page * limit,
        hasPrev: page > 1,
      };

      return { data, meta };
    } catch (error) {
      console.error('FindAll operation failed:', error);
      throw new BadRequestException(ErrorMessages.DATABASE_ERROR);
    }
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    try {
      const record = await this.findById(id);
      const updatedEntity = this.repository.merge(record, data);
      return await this.repository.save(updatedEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Update operation failed:', error);
      throw new BadRequestException(this.getUpdateErrorMessage());
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.findById(id);
      await this.repository.softDelete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Delete operation failed:', error);
      throw new BadRequestException(this.getDeleteErrorMessage());
    }
  }

  /**
   * Check if a record exists by a specific field
   * @param field - The field to check
   * @param value - The value to match
   * @returns Promise<boolean>
   */
  async existsByField<K extends keyof T>(
    field: K,
    value: T[K],
  ): Promise<boolean> {
    try {
      const whereCondition = { [field]: value } as FindOptionsWhere<T>;
      const count = await this.repository.count({ where: whereCondition });
      return count > 0;
    } catch (error) {
      console.error('ExistsByField operation failed:', error);
      return false;
    }
  }

  /**
   * Find records by a specific field
   * @param field - The field to search by
   * @param value - The value to match
   * @param relations - Optional relations to include
   * @returns Promise<T[]>
   */
  async findByField<K extends keyof T>(
    field: K,
    value: T[K],
    relations?: string[],
  ): Promise<T[]> {
    try {
      const options: FindManyOptions<T> = {
        where: { [field]: value } as FindOptionsWhere<T>,
        relations: relations || [],
      };

      return await this.repository.find(options);
    } catch (error) {
      console.error('FindByField operation failed:', error);
      throw new BadRequestException(ErrorMessages.DATABASE_ERROR);
    }
  }

  // async findByField<K extends keyof T>(
  //   field: K,
  //   value: T[K],
  //   options?: {
  //     relations?: string[];
  //     order?: { [P in keyof T]?: 'ASC' | 'DESC' };
  //     skip?: number;
  //     take?: number;
  //   },
  // ): Promise<T[]> {
  //   try {
  //     const findOptions: FindManyOptions<T> = {
  //       where: { [field]: value } as FindOptionsWhere<T>,
  //       relations: options?.relations || [],
  //       order: options?.order,
  //       skip: options?.skip,
  //       take: options?.take,
  //     };

  //     return await this.repository.find(findOptions);
  //   } catch (error) {
  //     console.error(
  //       `FindByField operation failed for ${String(field)}:`,
  //       error,
  //     );
  //     throw new BadRequestException(ErrorMessages.DATABASE_ERROR);
  //   }
  // }
  /**
   * Abstract methods to be implemented by child classes
   */
  protected abstract getCreateErrorMessage(): string;
  protected abstract getUpdateErrorMessage(): string;
  protected abstract getDeleteErrorMessage(): string;
  protected abstract getNotFoundErrorMessage(): string;
}
