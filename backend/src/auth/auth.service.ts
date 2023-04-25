import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import CreateUserDTO from './dto/create-user.dto';
import UsersService from '../users/users.service';
import User from '../users/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerData: CreateUserDTO) {
    try {
      const hashedPassword = await bcrypt.hash(registerData.password, await bcrypt.genSalt());

      const createdUser = await this.usersService.create({
        ...registerData,
        password: hashedPassword,
      });

      return createdUser;
    } catch (err) {
      throw new HttpException("User wasn't created", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async auth(email: string, password: string): Promise<User> {
    const user = await this.usersService.getByEmail(email);
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  getCookieWithToken(userId: number) {
    const payload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  getCookieForLogOut() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
  }
}
