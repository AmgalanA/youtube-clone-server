import { IsString, IsEmail, MinLength } from 'class-validator';

export class registerUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, {
    message: 'Password should contains at least 6 symbols',
  })
  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  secondName: string;
}
