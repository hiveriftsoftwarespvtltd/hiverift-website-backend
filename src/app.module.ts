import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from './config/mongo.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SubmitFromModule } from './sumbitfrom/sumbitfrom.module';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { CaseStudyModule } from './case-study/case-study.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api{/*path}', '/uploads{/*path}', '/hiverift_api{/*path}'],
      serveStaticOptions: {
        fallthrough: true,
      },
    }),
    MongooseModule.forRootAsync(mongoConfig),
    SubmitFromModule,
    BlogModule,
    AuthModule,
    TestimonialModule,
    CaseStudyModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
