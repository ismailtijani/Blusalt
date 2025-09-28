import { Injectable } from '@nestjs/common';
import { CreateDeliveryRequestDto } from './dto/create-delivery-request.dto';
import { UpdateDeliveryRequestDto } from './dto/update-delivery-request.dto';

@Injectable()
export class DeliveryRequestService {
  create(createDeliveryRequestDto: CreateDeliveryRequestDto) {
    return 'This action adds a new deliveryRequest';
  }

  findAll() {
    return `This action returns all deliveryRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deliveryRequest`;
  }

  update(id: number, updateDeliveryRequestDto: UpdateDeliveryRequestDto) {
    return `This action updates a #${id} deliveryRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliveryRequest`;
  }
}
