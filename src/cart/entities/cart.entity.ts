import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CartProduct } from '../../cart-product/entities/cartProduct.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'numeric', default: '0' })
  totalPrice: string;

  @Column({ type: 'integer', default: 0 })
  totalItems: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // foreign keys
  @Column({ type: 'bigint' })
  userId: string;

  // relations
  @OneToMany(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart)
  cartProducts: CartProduct[];
  items: any;
}
