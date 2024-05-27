import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  ValidateNested,
} from 'class-validator';

export class CartDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CartItem)
  cartItems: CartItem[];
}

export class CartItem {
  @IsNotEmpty()
  @IsNumberString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
