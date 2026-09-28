import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { CaseStudyService } from './case-study.service';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const storage = diskStorage({
  destination: (req, file, callback) => {
    let uploadPath = join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(join(process.cwd(), 'package.json'))) {
      uploadPath = join(__dirname, '..', '..', 'public', 'uploads');
    }
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `case-study-${uniqueSuffix}${ext}`);
  },
});

@Controller('case-studies')
export class CaseStudyController {
  constructor(private readonly caseStudyService: CaseStudyService) {}

  // Public endpoint for live portfolio page and homepage carousel
  @Get()
  async getPublished() {
    const data = await this.caseStudyService.findAllPublished();
    return { success: true, count: data.length, data };
  }

  // Admin endpoint to view all case studies (including drafts)
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Sales')
  async getAllAdmin() {
    const data = await this.caseStudyService.findAllAdmin();
    return { success: true, count: data.length, data };
  }

  // Public endpoint to view a single case study by ID or slug
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const data = await this.caseStudyService.findOne(id);
    return { success: true, data };
  }

  // Admin: Create new case study with optional screenshot upload
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Sales')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async create(
    @Body() dto: CreateCaseStudyDto,
    @UploadedFile() file?: any,
  ) {
    const data = await this.caseStudyService.create(dto, file);
    return { success: true, message: 'Case study created successfully', data };
  }

  // Admin: Update existing case study
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Sales')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateCaseStudyDto>,
    @UploadedFile() file?: any,
  ) {
    const data = await this.caseStudyService.update(id, dto, file);
    return { success: true, message: 'Case study updated successfully', data };
  }

  // Admin: Toggle publish / draft status
  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Sales')
  async togglePublish(@Param('id') id: string) {
    const data = await this.caseStudyService.togglePublish(id);
    return {
      success: true,
      message: `Case study is now ${data.isPublished ? 'published' : 'draft'}`,
      data,
    };
  }

  // Admin: Delete case study
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async delete(@Param('id') id: string) {
    return this.caseStudyService.delete(id);
  }
}
