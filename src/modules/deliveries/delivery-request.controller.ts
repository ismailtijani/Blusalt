import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeliveryRequestService } from './delivery-request.service';
import { CreateDeliveryRequestDto } from './dto/create-delivery-request.dto';
import { UpdateDeliveryRequestDto } from './dto/update-delivery-request.dto';

@Controller('delivery-request')
export class DeliveryRequestController {
  constructor(
    private readonly deliveryRequestService: DeliveryRequestService,
  ) {}

  @Post()
  create(@Body() createDeliveryRequestDto: CreateDeliveryRequestDto) {
    return this.deliveryRequestService.create(createDeliveryRequestDto);
  }

  @Get()
  findAll() {
    return this.deliveryRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryRequestService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryRequestDto: UpdateDeliveryRequestDto,
  ) {
    return this.deliveryRequestService.update(+id, updateDeliveryRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryRequestService.remove(+id);
  }
}
