import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { DataSource, EntityManager } from 'typeorm';
  import { UserService } from '../user/user.service';
  import * as bcrypt from 'bcrypt';
  import { User } from '@/user/entities/user.entity';
  import { UserSignInDto, UserSignUpDto } from './dto/dto';
  import { TokenService } from '../auth/token/token.service';
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly userService: UserService,
      private readonly tokenService: TokenService,
    ) {}
  
    async verifiedToken(accessToken: string): Promise<User> {
      const user = await this.tokenService.verifyToken(accessToken);
  
      if (!user) {
        throw new UnauthorizedException('Invalid Token');
      }
      return user;
    }
  
    async signup(
      userSignUpDto: UserSignUpDto,
    ): Promise<{ user: User; accessToken: string }> {
      const user = await this.userService.createUser(userSignUpDto);
      const accessToken = this.tokenService.generateAccessToken(user);
  
      if (!user || !accessToken) {
        throw new UnauthorizedException();
      }
      return { user, accessToken };
    }
  
    async signin(
      userSignInDto: UserSignInDto,
    ): Promise<{ user: User; verifyT: string }> {
      const { email, password } = userSignInDto;
  
      const user = await this.userService.getUserByEmail(email);
  
      if (!user) {
        throw new BadRequestException('Invalid email');
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
  
      const accessToken = this.tokenService.generateAccessToken(user);
      const verifyT = accessToken;
  
      return { user, verifyT };
    }
  }
  