import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { User } from '../entities/user.entity';
import { IsAuthenticated } from '../guards/user.guard';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private UsersService: UserService,
  ) {}

  @Post('signup')
  @UseGuards(IsAuthenticated)
  async signup(
    @Body() userSignUpDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signup(userSignUpDto);
  }

  @Post('signin')
  @UseGuards(IsAuthenticated)
  signin(
    @Body() userSignInDto: CreateUserDto,
  ): Promise<{ user: User; verifyT: string }> {
    return this.authService.signin(userSignInDto);
  }

  @Get('view-all-user')
  async getAllUsers(): Promise<User[]> {
    const allUser = await this.UsersService.getUsers();
    return allUser;
  }

  @Get(':id')
  async getUser(@Param('id') userId: string): Promise<User> {
    const user = await this.UsersService.getUserById(userId);
    if (user) {
      return user;
    }
  }
}
