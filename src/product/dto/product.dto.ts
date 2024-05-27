
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProductCategory } from 'src/lib/enums';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsNumber()
  price: string;

  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsNotEmpty()
  @IsNumber()
  stockQuantity: number;

  @IsEnum(ProductCategory)
  productCategory: ProductCategory;
  priceMin: any;
}
