import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('api/blusalt/v1')
  getHello(): string {
    return 'Welcome to Blusalt Drone Logistics API!';
  }
}
