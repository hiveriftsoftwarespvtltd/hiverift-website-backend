import { IsNotEmpty, IsOptional, IsString, IsEnum, IsBoolean, IsNumber } from 'class-validator';

export class CreateCaseStudyDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsEnum(['web', 'ecommerce', 'software'])
  category?: 'web' | 'ecommerce' | 'software';

  @IsOptional()
  @IsString()
  categoryLabel?: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  client?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  timeline?: string;

  @IsOptional()
  services?: any;

  @IsOptional()
  techStack?: any;

  @IsOptional()
  @IsString()
  challenge?: string;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  keyFeatures?: any;

  @IsOptional()
  @IsString()
  howWeStarted?: string;

  @IsOptional()
  humanTouchPoints?: any;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  projectUrl?: string;

  @IsOptional()
  isPublished?: any;

  @IsOptional()
  order?: any;
}
