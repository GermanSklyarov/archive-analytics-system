import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, GetUsersQueryDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }

  async findAll(query: GetUsersQueryDto) {
    const { page = 1, limit = 10, sortBy = 'id', order = 'ASC' } = query;

    const [data, total] = await this.userRepo.findAndCount({
      order: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    Object.assign(user, dto);

    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    await this.userRepo.remove(user);

    return { deleted: true };
  }

  async removeMany(ids: number[]) {
    await this.userRepo.delete(ids);
    return { deleted: true };
  }
}
