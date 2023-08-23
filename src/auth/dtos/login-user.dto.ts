import { IsEmail, MinLength, IsString } from 'class-validator';

export class loginUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, {
    message: 'Password should contains at least 6 symbols',
  })
  @IsString()
  password: string;
}
