import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class UpdateCartDto {
  @ValidateNested()
  @IsNotEmpty()
  cartItems: UpdateCartItem[];
}

export class UpdateCartItem {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
