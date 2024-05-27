import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class Product_DetailsDto {
  @IsNotEmpty()
  @IsString()
  specification: string;

  @IsNotEmpty()
  @IsString()
  colour: string;

  @IsNotEmpty()
  @IsNumberString()
  size: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;
}
