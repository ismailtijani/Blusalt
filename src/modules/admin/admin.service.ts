import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BaseService,
  ErrorMessages,
  HelperService,
  JwtHandler,
  JwtPayload,
  PaginatedResult,
} from 'src/shared';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './entities/admin.entity';
import { GetAdminsQueryDto } from './dto/admin-query.dto';
import { LoginDto } from '../auth/dto/login.dto';

@Injectable()
export class AdminService extends BaseService<Admin> {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly helperService: HelperService,
    private readonly jwtService: JwtHandler,
  ) {
    super(adminRepository);
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const existingAdmin = await this.existsByField(
      'email',
      createAdminDto.email,
    );
    if (existingAdmin) {
      throw new BadRequestException(ErrorMessages.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this.helperService.hashData(
      createAdminDto.password,
    );

    const admin = await this.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    return admin;
  }

  async login(loginDto: LoginDto) {
    const admin = await this.validateUser(loginDto.email, loginDto.password);

    const payload: JwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };
    const tokens = await this.jwtService.generateTokens(payload);
    return { ...admin, ...tokens };
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return await this.repository.findOne({
      where: { email, isActive: true },
    });
  }

  async getAllAdmins(
    queryData: GetAdminsQueryDto,
  ): Promise<PaginatedResult<Admin>> {
    const { page = 1, limit = 10, searchTerm } = queryData;
    const skip = (page - 1) * limit;

    let queryBuilder = this.adminRepository.createQueryBuilder('admin');

    if (searchTerm) {
      queryBuilder = queryBuilder.where(
        '(LOWER(admin.firstName) LIKE LOWER(:search) OR LOWER(admin.lastName) LIKE LOWER(:search) OR LOWER(admin.email) LIKE LOWER(:search))',
        { search: `%${searchTerm}%` },
      );
    }

    const [admins, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('admin.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: admins,
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

  private async validateUser(email: string, password: string): Promise<Admin> {
    const admin = await this.findByEmail(email);

    if (!admin) {
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this.helperService.compareHashedData(
      password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDENTIALS);
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return admin;
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
