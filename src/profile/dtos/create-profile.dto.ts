import { IsString, IsNumber } from 'class-validator';

export class createProfileDto {
  @IsNumber()
  userId: number;

  @IsString()
  name?: string;

  @IsString()
  secondName?: string;
}
