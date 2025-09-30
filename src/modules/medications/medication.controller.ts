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
  Req,
} from '@nestjs/common';
import { MedicationService } from './medication.service';
import {
  AuthGuard,
  CurrentUser,
  GetIpAddress,
  GetUser,
  GetUserAgent,
  ResponseMessages,
  Routes,
  Serialize,
  SuccessResponse,
} from 'src/shared';
import { MedicationResponseDto } from './dto/medication-response.dto';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { MedicationQueryDto } from './dto/medication-query.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('medications')
export class MedicationController {
  constructor(
    private readonly medicationService: MedicationService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post(Routes.CREATE_MEDICATION)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(MedicationResponseDto)
  async createMedication(
    @Body() createMedicationDto: CreateMedicationDto,
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    const medication =
      await this.medicationService.createMedication(createMedicationDto);
    // Emit activity log
    this.eventEmitter.emit('onUserActivity', {
      action: createMedicationDto,
      description: 'Create Medication',
      feedback: medication,
      identity: user.email,
      maskedAction: false,
      maskedFeedback: false,
      what: req.originalUrl,
      when: new Date().toISOString(),
      owner: user.sub,
      ipAddress,
      userAgent,
    });
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
    @GetUser() user: CurrentUser,
    @GetIpAddress() ipAddress: string,
    @GetUserAgent() userAgent: string,
    @Req() req: Request,
  ) {
    const medication = await this.medicationService.update(
      medicationId,
      updateMedicationDto,
    );

    // Emit activity log
    this.eventEmitter.emit('onUserActivity', {
      action: updateMedicationDto,
      description: 'Update Medication',
      feedback: medication,
      identity: user.email,
      maskedAction: false,
      maskedFeedback: false,
      what: req.originalUrl,
      when: new Date().toISOString(),
      owner: user.sub,
      ipAddress,
      userAgent,
    });
    return new SuccessResponse(ResponseMessages.MEDICATION_UPDATED, medication);
  }

  @Delete(Routes.DELETE_MEDICATION)
  @HttpCode(HttpStatus.OK)
  async deleteMedication(@Param('medicationId') medicationId: string) {
    await this.medicationService.delete(medicationId);
    return new SuccessResponse(ResponseMessages.MEDICATION_DELETED);
  }
}
