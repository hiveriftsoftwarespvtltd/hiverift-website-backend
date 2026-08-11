import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubmitFromDocument = SubmitFrom & Document;

@Schema({
  timestamps: true,
  collection: 'submitfroms',
  autoCreate: false,
  autoIndex: false,
})
export class SubmitFrom {
  @Prop({ required: false })
  fullName?: string;

  @Prop({ required: false })
  name?: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: false })
  position?: string;

  @Prop({ required: false })
  company?: string;

  @Prop({ required: false })
  service?: string;

  @Prop({ required: false })
  message?: string;

  @Prop({ required: false })
  resume?: string;

  @Prop({ required: false })
  portfolio?: string;

  @Prop({ required: false })
  coverLetter?: string;

  @Prop({ required: false, default: 'Pending' })
  status?: string;
}

export const SubmitFromSchema = SchemaFactory.createForClass(SubmitFrom);
SubmitFromSchema.set('autoCreate', false);
SubmitFromSchema.set('autoIndex', false);
