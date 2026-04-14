import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Имя пользователя.', example: 'Ivan Petrov' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Электронная почта пользователя.',
    example: 'ivan.petrov@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Роль пользователя в системе.',
    example: 'admin',
    enum: ['admin', 'user'],
  })
  @IsString()
  @IsIn(['admin', 'user'])
  role: string;
}
