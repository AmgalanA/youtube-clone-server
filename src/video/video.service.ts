import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileService, FileType } from 'src/file/file.service';
import { updateVideoDto } from './dtos/update-video.dto';
import { sendCommentDto } from './dtos/send-comment.dto';
import { toggleLikeCommentDto } from './dtos/toggle-like-comment.dto';
import { toggleLikeDto } from './dtos/toggle-like.dto';
import { CommentModel } from './models/comment/comment.model';
import { LikeModel } from './models/like/like.model';
import { VideoModel } from './models/video/video.model';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(VideoModel) private videoRepository: typeof VideoModel,
    @InjectModel(LikeModel) private likeRepository: typeof LikeModel,
    @InjectModel(CommentModel) private commentRepository: typeof CommentModel,
    private fileService: FileService,
  ) {}

  async uploadVideoFile(file: Express.Multer.File, senderId: number) {
    const videoUrl = this.fileService.createFile(FileType.VIDEO_URL, file);

    const video = await this.videoRepository.create({
      senderId,
      videoUrl,
    });

    return video.id;
  }

  async update(dto: updateVideoDto, thumbnailFile: Express.Multer.File) {
    const video = await this.byId(dto.id);

    const thumbnail = this.fileService.createFile(
      FileType.THUMBNAIL_URL,
      thumbnailFile,
    );

    video.thumbnail = thumbnail;
    video.caption = dto.caption;

    return video.save();
  }

  async byId(id: number) {
    const video = await this.videoRepository.findOne({
      where: { id },
      include: { all: true },
    });

    if (!video) {
      throw new BadRequestException(`No video with id: ${id}.`);
    }

    return video;
  }

  async toggleLike(dto: toggleLikeDto) {
    const like = await this.likeRepository.findOne({
      where: {
        videoId: dto.videoId,
        profileId: dto.profileId,
      },
    });

    if (like) {
      const likeId = like.id;

      await like.destroy();

      return likeId;
    } else {
      const videoLike = await this.likeRepository.create(dto);

      return videoLike;
    }
  }

  async getAll(limit?: number) {
    const videos = await this.videoRepository.findAll({
      limit,
      include: { all: true },
    });

    return videos;
  }

  async sendComment(dto: sendCommentDto) {
    const comment = await this.commentRepository.create(dto);

    return comment;
  }

  async commentById(commentId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new BadRequestException(`No comment with id: ${commentId}.`);
    }

    return comment;
  }

  async toggleLikeComment(dto: toggleLikeCommentDto) {
    const comment = await this.commentById(dto.commentId);

    if (comment.likes.includes(dto.profileId)) {
      comment.likes = comment.likes.filter(
        (likerId) => likerId !== dto.profileId,
      );
    } else {
      comment.likes = [...comment.likes, dto.profileId];
    }

    return comment.save();
  }
}
