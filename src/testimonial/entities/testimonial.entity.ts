import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

@Schema({
  timestamps: true,
  collection: 'testimonials',
})
export class Testimonial {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ default: 'Client', trim: true })
  role?: string;

  @Prop({ default: 'Verified Business', trim: true })
  company?: string;

  @Prop({ default: 'Delhi NCR, India', trim: true })
  location?: string;

  @Prop({ default: 5, min: 1, max: 5 })
  rating?: number;

  @Prop({ default: 'Recent', trim: true })
  timeAgo?: string;

  @Prop({ default: 'Website & Digital Engineering', trim: true })
  service?: string;

  @Prop({ required: true, trim: true })
  text!: string;

  @Prop({ default: 'bg-emerald-600' })
  avatarBg?: string;

  @Prop({ default: 'Verified Client' })
  badge?: string;

  @Prop({ default: 'https://share.google/1cVJXMZ1i6L0uR5sf' })
  googleReviewUrl?: string;

  @Prop({ default: true })
  isPublished?: boolean;

  @Prop({ default: 0 })
  order?: number;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
