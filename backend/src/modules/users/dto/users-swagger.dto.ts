import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ivan Petrov' })
  name: string;

  @ApiProperty({ example: 'ivan.petrov@example.com' })
  email: string;

  @ApiProperty({ example: 'admin' })
  role: string;

  @ApiProperty({ example: '2026-04-14T10:00:00.000Z' })
  created_at: Date;
}

export class UsersListResponseDto {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];

  @ApiProperty({ example: 12 })
  total: number;
}
