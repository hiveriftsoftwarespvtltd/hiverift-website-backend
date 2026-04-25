import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SubmitFromService } from './sumbitfrom.service';
import { CreateSubmitFromDto } from './dto/create-sumbitfrom.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('submitfrom')
export class SubmitFromController {
  constructor(private readonly service: SubmitFromService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: memoryStorage(),
    }),
  )
  create(
    @Body() dto: CreateSubmitFromDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.create(dto, file);
  }
}
