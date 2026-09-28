import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from './entities/testimonial.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('testimonials')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  // Public endpoint for homepage carousel
  @Get()
  async getPublished() {
    const data = await this.testimonialService.findAllPublished();
    return { success: true, count: data.length, data };
  }

  // Admin endpoint to view all (including drafts/unpublished)
  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Sales')
  async getAllAdmin() {
    const data = await this.testimonialService.findAllAdmin();
    return { success: true, count: data.length, data };
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const data = await this.testimonialService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Sales')
  async create(@Body() body: Partial<Testimonial>) {
    const data = await this.testimonialService.create(body);
    return { success: true, message: 'Review added successfully', data };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Sales')
  async update(@Param('id') id: string, @Body() body: Partial<Testimonial>) {
    const data = await this.testimonialService.update(id, body);
    return { success: true, message: 'Review updated successfully', data };
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Sales')
  async togglePublish(@Param('id') id: string) {
    const data = await this.testimonialService.togglePublish(id);
    return {
      success: true,
      message: `Review is now ${data.isPublished ? 'published' : 'hidden'}`,
      data,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  async delete(@Param('id') id: string) {
    return this.testimonialService.delete(id);
  }
}
