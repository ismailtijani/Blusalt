import { Module } from '@nestjs/common';
import { DeliveryRequestService } from './delivery-request.service';
import { DeliveryRequestController } from './delivery-request.controller';

@Module({
  controllers: [DeliveryRequestController],
  providers: [DeliveryRequestService],
})
export class DeliveryRequestModule {}
