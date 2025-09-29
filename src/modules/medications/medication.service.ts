import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './entities/medication.entity';
import { BaseService, ErrorMessages } from 'src/shared';
import { CreateMedicationDto } from './dto/create-medication.dto';

@Injectable()
export class MedicationService extends BaseService<Medication> {
  constructor(
    @InjectRepository(Medication)
    medicationRepository: Repository<Medication>,
    // private readonly auditLogService: AuditLogService,
  ) {
    super(medicationRepository);
  }

  async createMedication(
    createMedicationDto: CreateMedicationDto,
    // userId?: string,
  ): Promise<Medication> {
    // Validate medication name (only letters, numbers, '-', '_')
    if (!this.isValidMedicationName(createMedicationDto.name)) {
      throw new BadRequestException(ErrorMessages.INVALID_MEDICATION_NAME);
    }

    // Validate medication code (only uppercase letters, underscore and numbers)
    if (!this.isValidMedicationCode(createMedicationDto.code)) {
      throw new BadRequestException(ErrorMessages.INVALID_MEDICATION_CODE);
    }

    const existingMedication = await this.existsByField(
      'code',
      createMedicationDto.code.toUpperCase(),
    );
    if (existingMedication) {
      throw new BadRequestException(ErrorMessages.MEDICATION_ALREADY_EXISTS);
    }

    const medication = await this.create({
      ...createMedicationDto,
      code: createMedicationDto.code.toUpperCase(),
      isActive: true,
    });

    // await this.auditLogService.log({
    //   action: 'CREATE',
    //   entityType: 'Medication',
    //   entityId: medication.id,
    //   userId,
    //   description: `Medication ${medication.name} (${medication.code}) created`,
    // });

    return medication;
  }

  async getActiveMedications() {
    return await this.repository.find({
      where: { isActive: true },
      select: [
        'id',
        'name',
        'code',
        'weight',
        'type',
        'imageUrl',
        'description',
      ],
    });
  }

  // Search medications by name or code
  async searchMedications(searchTerm: string) {
    return await this.repository
      .createQueryBuilder('medication')
      .where('medication.isActive = :isActive', { isActive: true })
      .andWhere(
        '(LOWER(medication.name) LIKE LOWER(:searchTerm) OR UPPER(medication.code) LIKE UPPER(:searchTerm))',
        { searchTerm: `%${searchTerm}%` },
      )
      .getMany();
  }

  // Validate medication name format
  private isValidMedicationName(name: string): boolean {
    const nameRegex = /^[a-zA-Z0-9_-]+$/;
    return nameRegex.test(name);
  }

  // Validate medication code format
  private isValidMedicationCode(code: string): boolean {
    const codeRegex = /^[A-Z0-9_]+$/;
    return codeRegex.test(code);
  }

  // Override base service methods
  protected getCreateErrorMessage(): string {
    return ErrorMessages.MEDICATION_CREATE_FAILED;
  }

  protected getUpdateErrorMessage(): string {
    return ErrorMessages.MEDICATION_UPDATE_FAILED;
  }

  protected getDeleteErrorMessage(): string {
    return ErrorMessages.MEDICATION_DELETE_FAILED;
  }

  protected getNotFoundErrorMessage(): string {
    return ErrorMessages.MEDICATION_NOT_FOUND;
  }
}
