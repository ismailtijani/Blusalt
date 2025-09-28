import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryRequestService } from './delivery-request.service';

describe('DeliveryRequestService', () => {
  let service: DeliveryRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryRequestService],
    }).compile();

    service = module.get<DeliveryRequestService>(DeliveryRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
