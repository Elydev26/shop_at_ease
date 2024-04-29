import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import bcrypt from 'bcrypt';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class UserService {
  private dbManager: EntityManager;
  constructor(private readonly datasource: DataSource) {
    this.dbManager = datasource.manager;
  }

  async createUser(userSignUpDto: CreateUserDto): Promise<User> {
    const { password } = userSignUpDto;

    const existingUser = await this.dbManager.findOne(User, {
      where: {
        email: userSignUpDto.email,
      },
    });
    if (existingUser) {
      throw new ConflictException('Email already exist!!');
    }
    const hash = bcrypt.hashSync(password, 10);

    const newUser = this.dbManager.create(User, {
      ...userSignUpDto,
      password: hash,
    });

    const savedNewUser = await this.dbManager.save(newUser);

    if (!savedNewUser) {
      throw new BadRequestException(' No user was created');
    }
    return savedNewUser;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.dbManager.findOne(User, {
      where: {
        email: email,
      },
    });

    return user;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.dbManager.findOneBy(User, { id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await this.dbManager.find(User, {
      select: ['firstName', 'lastName', 'email'],
    });
    return users;
  }
}
