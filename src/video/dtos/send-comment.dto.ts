import { IsString } from 'class-validator';

export class sendCommentDto {
  @IsString()
  text: string;

  @IsString()
  senderId: number;

  @IsString()
  videoId: number;
}
