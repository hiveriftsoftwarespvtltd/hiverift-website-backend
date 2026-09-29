import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      status: 'success',
      message: 'HiveRift API v1 is active and running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
