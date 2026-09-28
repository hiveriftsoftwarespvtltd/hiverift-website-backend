import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CaseStudyDocument = CaseStudy & Document;

@Schema({ _id: false })
export class HumanTouchPoint {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;
}

export const HumanTouchPointSchema = SchemaFactory.createForClass(HumanTouchPoint);

@Schema({
  timestamps: true,
  collection: 'casestudies',
})
export class CaseStudy {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  projectId!: string;

  @Prop({ required: true, enum: ['web', 'ecommerce', 'software'], default: 'web' })
  category!: 'web' | 'ecommerce' | 'software';

  @Prop({ required: true, trim: true, default: 'Web Development' })
  categoryLabel!: string;

  @Prop({ required: true, trim: true })
  description!: string;

  @Prop({ default: 'Client Partner', trim: true })
  client?: string;

  @Prop({ default: 'Technology & Web', trim: true })
  industry?: string;

  @Prop({ default: '4-6 Weeks', trim: true })
  timeline?: string;

  @Prop({ type: [String], default: [] })
  services?: string[];

  @Prop({ type: [String], default: [] })
  techStack?: string[];

  @Prop({ default: '' })
  challenge?: string;

  @Prop({ default: '' })
  solution?: string;

  @Prop({ type: [String], default: [] })
  keyFeatures?: string[];

  @Prop({ default: '' })
  howWeStarted?: string;

  @Prop({ type: [HumanTouchPointSchema], default: [] })
  humanTouchPoints?: HumanTouchPoint[];

  @Prop({ required: true, default: '/case-studies/image_01.webp' })
  image!: string;

  @Prop({ default: 'https://hiverift.com/' })
  projectUrl?: string;

  @Prop({ default: true })
  isPublished?: boolean;

  @Prop({ default: 0 })
  order?: number;
}

export const CaseStudySchema = SchemaFactory.createForClass(CaseStudy);
CaseStudySchema.index({ projectId: 1 });
CaseStudySchema.index({ category: 1, isPublished: 1 });
