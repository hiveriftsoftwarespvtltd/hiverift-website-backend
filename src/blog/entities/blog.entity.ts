import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ _id: false, autoCreate: false })
export class BlogSection {
  @Prop({ required: true })
  heading!: string;

  @Prop({ required: true })
  text!: string;
}

export const BlogSectionSchema = SchemaFactory.createForClass(BlogSection);

@Schema({ _id: false, autoCreate: false })
export class BlogContentDetail {
  @Prop({ required: true })
  intro!: string;

  @Prop({ type: [String], default: [] })
  keyTakeaways!: string[];

  @Prop({ type: [BlogSectionSchema], default: [] })
  sections!: BlogSection[];

  @Prop({ required: false })
  quote?: string;

  @Prop({ required: true })
  conclusion!: string;
}

export const BlogContentDetailSchema = SchemaFactory.createForClass(BlogContentDetail);

@Schema({
  timestamps: true,
  collection: 'blogs',
  autoCreate: false,
  autoIndex: false,
})
export class Blog {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: false })
  slug?: string;

  @Prop({ required: true })
  desc!: string;

  @Prop({ required: true })
  category!: string;

  @Prop({ required: false, default: '4 min read' })
  readTime?: string;

  @Prop({ required: true, default: 'HiveRift Team' })
  author!: string;

  @Prop({ required: false, default: 'Tech & Product Strategy' })
  authorRole?: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ type: BlogContentDetailSchema, required: true })
  content!: BlogContentDetail;

  @Prop({ required: false, default: true })
  isPublished?: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.set('autoCreate', false);
BlogSchema.set('autoIndex', false);
