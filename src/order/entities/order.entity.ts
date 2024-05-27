import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliveryStatus, PaymentStatus } from '../../lib/enums';
import { Cart } from '../../cart/entities/cart.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isPaid: boolean;

  @Column({ type: 'date' })
  orderDate: Date;

  @Column({ type: 'enum', enum: DeliveryStatus })
  deliveryStatus: DeliveryStatus;

  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  //foreign key

  @Column({ type: 'varchar', nullable: false })
  cartId: string;

  //relation

  @OneToOne(() => Cart)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  user: User;
}
