import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import Redis from 'ioredis';
import { Response } from 'express';
import CreateUserDTO from './dto/create-user.dto';
import UserDTO from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';
import SignInDTO from './dto/sign-in.dto';
import JwtAuthenticationGuard from './jwt-auth.guard';
import { LocalAuthenticationGuard } from './local-auth.guard';
import RequestWithUser from './request-with-user.interface';
import { CheckActivityInterceptor } from './check-activity.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiInternalServerErrorResponse()
  @ApiOkResponse({
    description: 'User has been created',
    type: UserDTO,
  })
  async register(@Body() registrationData: CreateUserDTO, @Res() response: Response) {
    try {
      const createdUser = await this.authService.register(registrationData);

      response.setHeader('Set-Cookie', this.authService.getCookieWithToken(createdUser.id));

      createdUser.password = undefined;
      return response.send(createdUser);
    } catch (err) {
      throw new HttpException("User wasn't created", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse()
  @ApiOkResponse({ type: UserDTO })
  @UseGuards(LocalAuthenticationGuard)
  @UseInterceptors(CheckActivityInterceptor)
  async auth(
    @Req() request: RequestWithUser,
    @Body() signInData: SignInDTO,
    @Res() response: Response,
  ) {
    const { user } = request;

    response.setHeader('Set-Cookie', this.authService.getCookieWithToken(user.id));

    user.password = undefined;
    return response.send(user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDTO })
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(CheckActivityInterceptor)
  async checkIfUserIsAuthenticated(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(CheckActivityInterceptor)
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }
}
