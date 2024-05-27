import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/auth/token/token.service';
import { UserService } from 'src/user/services/user.service';
import { ProductService } from 'src/product/services/product.service';

@Module({
  controllers: [CartController],
  providers: [
    CartService,
    TokenService,
    UserService,
    JwtService,
    ProductService,
  ],
  exports: [CartService],
})
export class CartModule {}
