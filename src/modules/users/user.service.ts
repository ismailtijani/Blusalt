import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  BaseService,
  ErrorMessages,
  HelperService,
  PaginatedResult,
  UserRole,
} from 'src/shared';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
    private readonly helperService: HelperService,
  ) {
    super(userRepository);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.existsByField('email', createUserDto.email);
    if (existingUser) {
      throw new BadRequestException(ErrorMessages.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this.helperService.hashData(
      createUserDto.password,
    );

    const user = await this.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email, isActive: true },
    });
  }

  async findByEmailIncludeInactive(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.repository.update(userId, { refreshToken });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.repository.update(userId, { lastLoginAt: new Date() });
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const existingUser = await this.findById(userId);

    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.existsByField(
        'email',
        updateUserDto.email,
      );
      if (emailExists) {
        throw new BadRequestException(ErrorMessages.EMAIL_ALREADY_EXISTS);
      }
    }

    const updatedUser = await this.update(userId, updateUserDto);
    return updatedUser;
  }

  async getUsers(queryData: GetUsersQueryDto): Promise<PaginatedResult<User>> {
    const {
      page = 1,
      limit = 10,
      searchTerm,
      role,
      userType,
      isActive,
    } = queryData;
    const skip = (page - 1) * limit;

    let queryBuilder = this.repository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.role',
        'user.userType',
        'user.organizationName',
        'user.phoneNumber',
        'user.isActive',
        'user.isVerified',
        'user.lastLoginAt',
        'user.createdAt',
      ]);

    // Apply filters
    if (searchTerm) {
      queryBuilder = queryBuilder.where(
        '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search) OR LOWER(user.organizationName) LIKE LOWER(:search))',
        { search: `%${searchTerm}%` },
      );
    }

    if (role) {
      queryBuilder = queryBuilder.andWhere('user.role = :role', { role });
    }

    if (userType) {
      queryBuilder = queryBuilder.andWhere('user.userType = :userType', {
        userType,
      });
    }

    if (isActive !== undefined) {
      queryBuilder = queryBuilder.andWhere('user.isActive = :isActive', {
        isActive,
      });
    }

    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: total > page * limit,
        hasPrev: page > 1,
      },
    };
  }

  async getUserStatsByRole(): Promise<Record<UserRole, number>> {
    const stats = await this.repository
      .createQueryBuilder('user')
      .select('user.role, COUNT(*) as count')
      .groupBy('user.role')
      .getRawMany();

    const result: Record<string, number> = {};
    for (const stat of stats) {
      result[stat.user_role] = parseInt(stat.count);
    }

    return result as Record<UserRole, number>;
  }

  async getUserStatsByType(): Promise<Record<string, number>> {
    const stats = await this.repository
      .createQueryBuilder('user')
      .select('user.userType, COUNT(*) as count')
      .where('user.userType IS NOT NULL')
      .groupBy('user.userType')
      .getRawMany();

    const result: Record<string, number> = {};
    for (const stat of stats) {
      result[stat.user_usertype || 'UNKNOWN'] = parseInt(stat.count);
    }

    return result;
  }

  async getRecentUsers(days: number = 7): Promise<User[]> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    return await this.repository.find({
      where: {
        createdAt: MoreThan(dateThreshold),
      },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'userType',
        'organizationName',
        'createdAt',
      ],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async toggleUserStatus(userId: string, isActive: boolean): Promise<User> {
    await this.findById(userId);
    const updatedUser = await this.update(userId, { isActive });
    return updatedUser;
  }

  async verifyUser(userId: string): Promise<User> {
    await this.findById(userId);
    const updatedUser = await this.update(userId, { isVerified: true });

    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.findById(userId);
    await this.delete(userId);
  }

  async getClientUsers(): Promise<User[]> {
    return await this.repository.find({
      where: {
        role: UserRole.USER,
        isActive: true,
        isVerified: true,
      },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'organizationName',
        'userType',
        'phoneNumber',
      ],
      order: { organizationName: 'ASC' },
    });
  }

  async getStaffUsers(): Promise<User[]> {
    return await this.repository.find({
      where: {
        role: In([UserRole.ADMIN, UserRole.STAFF]),
        isActive: true,
      },
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'lastLoginAt'],
      order: { lastLoginAt: 'DESC' },
    });
  }

  protected getCreateErrorMessage(): string {
    return ErrorMessages.USER_CREATE_FAILED;
  }

  protected getUpdateErrorMessage(): string {
    return ErrorMessages.USER_UPDATE_FAILED;
  }

  protected getDeleteErrorMessage(): string {
    return ErrorMessages.USER_DELETE_FAILED;
  }

  protected getNotFoundErrorMessage(): string {
    return ErrorMessages.USER_NOT_FOUND;
  }
}
