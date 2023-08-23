import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { VideoModel } from './models/video/video.model';
import { FileModule } from 'src/file/file.module';
import { CommentModel } from './models/comment/comment.model';
import { LikeModel } from './models/like/like.model';

@Module({
  controllers: [VideoController],
  providers: [VideoService],
  imports: [
    SequelizeModule.forFeature([VideoModel, LikeModel, CommentModel]),
    FileModule,
  ],
})
export class VideoModule {}
