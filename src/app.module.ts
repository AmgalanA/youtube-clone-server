import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SequelizeModule } from '@nestjs/sequelize';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { TokenModule } from './token/token.module';
import { FileModule } from './file/file.module';
import { VideoModule } from './video/video.module';
import { CommentModel } from './video/models/comment/comment.model';
import { VideoModel } from './video/models/video/video.model';
import { ProfileModel } from './profile/models/profile.model';
import { LikeModel } from './video/models/like/like.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [CommentModel, ProfileModel, VideoModel, LikeModel],
      autoLoadModels: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),
    }),
    AuthModule,
    ProfileModule,
    TokenModule,
    FileModule,
    VideoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
