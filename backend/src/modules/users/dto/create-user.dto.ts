import { IsEmail, IsIn, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsIn(['admin', 'user'])
  role: string;
}
