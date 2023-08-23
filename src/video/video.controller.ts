import {
  Controller,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { sendCommentDto } from './dtos/send-comment.dto';
import { toggleLikeDto } from './dtos/toggle-like.dto';

import { updateVideoDto } from './dtos/update-video.dto';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() { senderId }: { senderId: number },
  ) {
    return this.videoService.uploadVideoFile(file, senderId);
  }

  @Get('get-all')
  async getAll(@Query('limit') limit: string) {
    return this.videoService.getAll(+limit);
  }

  @Get('/by-id/:id')
  async byId(@Param('id') id: string) {
    return this.videoService.byId(+id);
  }

  @Put('update')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: updateVideoDto,
  ) {
    return this.videoService.update(dto, file);
  }

  @Patch('toggle-like')
  async toggleLike(@Body() dto: toggleLikeDto) {
    return this.videoService.toggleLike(dto);
  }

  @Post('send-comment')
  async sendComment(@Body() dto: sendCommentDto) {
    return this.videoService.sendComment(dto);
  }
}
