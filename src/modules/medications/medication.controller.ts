import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { MedicationService } from './medication.service';
import {
  AuthGuard,
  ResponseMessages,
  Routes,
  Serialize,
  SuccessResponse,
} from 'src/shared';
import { MedicationResponseDto } from './dto/medication-response.dto';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { MedicationQueryDto } from './dto/medication-query.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@UseGuards(AuthGuard)
@Controller('medications')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Post(Routes.CREATE_MEDICATION)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(MedicationResponseDto)
  async createMedication(@Body() createMedicationDto: CreateMedicationDto) {
    const medication =
      await this.medicationService.createMedication(createMedicationDto);
    return new SuccessResponse(ResponseMessages.MEDICATION_CREATED, medication);
  }

  @Get(Routes.GET_MEDICATIONS)
  @HttpCode(HttpStatus.OK)
  @Serialize(MedicationResponseDto)
  async getMedications(@Query() queryData: MedicationQueryDto) {
    let result;
    if (queryData.searchTerm) {
      const medications = await this.medicationService.searchMedications(
        queryData.searchTerm,
      );
      result = { data: medications, meta: { total: medications.length } };
    } else {
      result = await this.medicationService.findAll(queryData);
    }
    return new SuccessResponse(ResponseMessages.MEDICATIONS_RETRIEVED, result);
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  @Serialize(MedicationResponseDto)
  async getActiveMedications() {
    const medications = await this.medicationService.getActiveMedications();
    return new SuccessResponse(
      ResponseMessages.MEDICATIONS_RETRIEVED,
      medications,
    );
  }

  @Get(Routes.GET_ONE_MEDICATION)
  @HttpCode(HttpStatus.OK)
  @Serialize(MedicationResponseDto)
  async getMedication(@Param('medicationId') medicationId: string) {
    const medication = await this.medicationService.findById(medicationId);
    return new SuccessResponse(
      ResponseMessages.MEDICATION_RETRIEVED,
      medication,
    );
  }

  @Patch(Routes.UPDATE_MEDICATION)
  @HttpCode(HttpStatus.OK)
  @Serialize(MedicationResponseDto)
  async updateMedication(
    @Param('medicationId') medicationId: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
  ) {
    const medication = await this.medicationService.update(
      medicationId,
      updateMedicationDto,
    );
    return new SuccessResponse(ResponseMessages.MEDICATION_UPDATED, medication);
  }

  @Delete(Routes.DELETE_MEDICATION)
  @HttpCode(HttpStatus.OK)
  async deleteMedication(@Param('medicationId') medicationId: string) {
    await this.medicationService.delete(medicationId);
    return new SuccessResponse(ResponseMessages.MEDICATION_DELETED);
  }
}
