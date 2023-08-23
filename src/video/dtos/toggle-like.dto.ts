import { IsString } from 'class-validator';

export class toggleLikeDto {
  @IsString()
  videoId: number;

  @IsString()
  profileId: number;
}
