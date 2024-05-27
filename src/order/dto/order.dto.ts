import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { PaymentStatus, DeliveryStatus } from 'src/lib/enums';

export class OrderDto {
  @IsNotEmpty()
  @IsString()
  cartId: string;

  @IsNotEmpty()
  @IsBoolean()
  isPaid: boolean;

  @IsNotEmpty()
  @IsDateString()
  orderDate: Date;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsEnum(DeliveryStatus)
  deliveryStatus: DeliveryStatus;
}
