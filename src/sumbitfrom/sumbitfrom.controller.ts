import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SubmitFromService } from './sumbitfrom.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('submitfrom')
export class SubmitFromController {
  constructor(private readonly service: SubmitFromService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body() dto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (dto.name || dto.message) {
      return this.service.createContactInquiry(dto);
    }
    return this.service.create(dto, file);
  }

  @Post('contact')
  createContact(@Body() dto: any) {
    return this.service.createContactInquiry(dto);
  }

  @Post('inquiry')
  createInquiry(@Body() dto: any) {
    return this.service.createContactInquiry(dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const status = typeof body === 'string' ? body : body?.status;
    return this.service.updateStatus(id, status);
  }

  @Put(':id/status')
  updateStatusPut(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const status = typeof body === 'string' ? body : body?.status;
    return this.service.updateStatus(id, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
