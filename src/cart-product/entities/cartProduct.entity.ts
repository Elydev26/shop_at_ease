import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Cart } from '../../cart/entities/cart.entity';

@Entity()
export class CartProduct {
  @PrimaryColumn({ type: 'bigint' })
  cartId: string;

  @PrimaryColumn({ type: 'bigint' })
  productId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'numeric' })
  price: string;

  @Column({ type: 'varchar' })
  image: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;

  //relation
  @ManyToOne(() => Cart, (cart) => cart.cartProducts)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartProducts)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
