import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './entities/testimonial.entity';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
  ) {}

  async findAllPublished(): Promise<Testimonial[]> {
    return this.testimonialModel
      .find({ isPublished: true })
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async findAllAdmin(): Promise<Testimonial[]> {
    return this.testimonialModel
      .find()
      .sort({ order: 1, createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Testimonial> {
    const item = await this.testimonialModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Testimonial with ID "${id}" not found`);
    }
    return item;
  }

  async create(data: Partial<Testimonial>): Promise<Testimonial> {
    const avatarBgs = [
      'bg-emerald-600',
      'bg-blue-600',
      'bg-purple-600',
      'bg-teal-600',
      'bg-amber-600',
      'bg-indigo-600',
    ];
    if (!data.avatarBg) {
      data.avatarBg = avatarBgs[Math.floor(Math.random() * avatarBgs.length)];
    }
    if (!data.googleReviewUrl) {
      data.googleReviewUrl = 'https://share.google/1cVJXMZ1i6L0uR5sf';
    }
    const created = new this.testimonialModel(data);
    return created.save();
  }

  async update(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
    const updated = await this.testimonialModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Testimonial with ID "${id}" not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.testimonialModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Testimonial with ID "${id}" not found`);
    }
    return { success: true, message: 'Testimonial deleted successfully' };
  }

  async togglePublish(id: string): Promise<Testimonial> {
    const item = await this.findOne(id);
    item.isPublished = !item.isPublished;
    return (item as TestimonialDocument).save();
  }
}
