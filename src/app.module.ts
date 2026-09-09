import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from './config/mongo.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SubmitFromModule } from './sumbitfrom/sumbitfrom.module';
import { BlogModule } from './blog/blog.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)', '/api/v1/(.*)', '/uploads/(.*)', '/hiverift_api/(.*)'],
      serveStaticOptions: {
        fallthrough: true,
      },
    }),
    MongooseModule.forRootAsync(mongoConfig),
    SubmitFromModule,
    BlogModule,
    AuthModule,
  ],
})
export class AppModule {}
