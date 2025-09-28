import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryRequestController } from './delivery-request.controller';
import { DeliveryRequestService } from './delivery-request.service';

describe('DeliveryRequestController', () => {
  let controller: DeliveryRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryRequestController],
      providers: [DeliveryRequestService],
    }).compile();

    controller = module.get<DeliveryRequestController>(DeliveryRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
