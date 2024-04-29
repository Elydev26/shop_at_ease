import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { AuthTokenPayload } from 'src/lib/type.lib';
import axios from 'axios';

@Injectable()
export class SharedService {
  constructor(private config: ConfigService, private jwtService: JwtService) {
    //
  }

  async hashPassword(data: string | Buffer) {
    const saltRounds = Number(this.config.get('HASH_SALT_ROUNDS') || 10);
    const hashedPassword = await hash(data, saltRounds);
    return hashedPassword;
  }

  async veryfyJwtToken(token: string): Promise<Record<string, unknown>> {
    const payload = await this.jwtService.verify(token, {
      secret: this.config.get('JWT_SECRET'),
    });
    return payload;
  }

  signPayload(
    payload: string | Buffer | AuthTokenPayload,
    // expiresIn?: string | number | JwtSignOptions,
  ): string {
    const stringifiedPayload =
      typeof payload === 'string' ? payload : JSON.stringify(payload);
    const token = this.jwtService.sign(stringifiedPayload, {
      secret: this.config.get('JWT_SECRET'),
    });
    return token;
  }

  async comparePassword(password: string, hashedPassword: string) {
    // hash password and compare with the one in the database
    const isPasswordCorrect = await compare(password, hashedPassword);
    return isPasswordCorrect;
  }
  async isTokenExpired(
    createdAt: Date,
    options: { expiresInHHours?: number; expiresInSeconds?: number },
  ) {
    const expiry = options.expiresInSeconds || options.expiresInHHours;
    const tokenExpirtyFactor = 1000 * 60 * options.expiresInHHours ? 60 : 1;
    const currentTime = Date.now();
    const timeDifferenceInMilliseconds = currentTime - createdAt.getTime();
    const expiryTime = expiry * tokenExpirtyFactor; // convert hours to milliseconds
    if (timeDifferenceInMilliseconds > expiryTime) {
      return true;
    }
    return false;
  }
}

