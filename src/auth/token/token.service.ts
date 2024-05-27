// token.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthTokenPayload } from 'src/lib/types';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';


@Injectable()
export class TokenService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'octoib';

  constructor(private readonly userService: UserService) {}

  generateAccessToken(user: User): string {
    const payload: AuthTokenPayload = {
      userData: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        //phone: user.phone,
      },
    };

    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '1h' });
  }

  async verifyToken(accessToken: string): Promise<User> {
    try {
      const decodedToken = jwt.verify(accessToken, this.JWT_SECRET) as {
        userId: string;
      };
      const user = await this.userService.getUserById(decodedToken.userId);

      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
