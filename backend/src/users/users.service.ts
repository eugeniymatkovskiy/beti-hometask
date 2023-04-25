import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateUserDTO from '../auth/dto/create-user.dto';
import UserEntity from './user.entity';
import User from './user.interface';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'name', 'password', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new HttpException(
        `User with this email: ${email} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async create(userData: CreateUserDTO): Promise<User> {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }
}
