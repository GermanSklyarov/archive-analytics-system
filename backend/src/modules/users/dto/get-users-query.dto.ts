import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';
import { User } from '../entities/user.entity';

type UserSortFields = keyof User;

export class GetUsersQueryDto {
  @ApiPropertyOptional({
    description: 'Номер страницы.',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Количество элементов на странице.',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Поле сортировки.',
    example: 'id',
    enum: ['id', 'name', 'email', 'role', 'created_at'],
    default: 'id',
  })
  @IsOptional()
  @IsIn(['id', 'name', 'email', 'role', 'created_at'])
  sortBy?: UserSortFields = 'id';

  @ApiPropertyOptional({
    description: 'Направление сортировки.',
    example: 'ASC',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC';
}
