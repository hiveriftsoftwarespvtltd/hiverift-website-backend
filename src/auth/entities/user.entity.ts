import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export type UserRole = 'Admin' | 'Sales' | 'Blog';

@Schema({
  timestamps: true,
  collection: 'cms_users',
})
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({
    required: true,
    enum: ['Admin', 'Sales', 'Blog'],
    default: 'Admin',
  })
  role!: UserRole;

  @Prop({ required: false })
  phone?: string;

  @Prop({ required: true, default: true })
  isActive!: boolean;

  @Prop({ required: false })
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
