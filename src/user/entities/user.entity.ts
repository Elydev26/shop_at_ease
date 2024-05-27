// import {
//     Column,
//     CreateDateColumn,
//     DeleteDateColumn,
//     Entity,
//     Index,
//     JoinColumn,
//     ManyToOne,
//     OneToMany,
//     OneToOne,
//     PrimaryGeneratedColumn,
//     UpdateDateColumn,
//   } from 'typeorm';
//   import { PhoneCode} from 'src/entities/phone.entity';
  
//   @Entity()
//   export class User {
//     @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
//     id: string;
  
//     @Index()
//     @Column({ type: 'varchar', default: '' })
//     firstName: string;
  
//     @Column({ type: 'varchar', default: '' })
//     middleName: string;
  
//     @Index()
//     @Column({ type: 'varchar', default: '' })
//     lastName: string;
  
//     @Index()
//     @Column({ type: 'varchar', nullable: true, unique: true })
//     email: string;
  
//     @Index()
//     @Column({ type: 'varchar', nullable: true, unique: true })
//     phone: string;
  
//     @Column({ type: 'bigint', nullable: true })
//     phoneCodeId: string;
  
//     @CreateDateColumn()
//     createdAt: Date;
  
//     @UpdateDateColumn()
//     updatedAt: Date;
  
//     @DeleteDateColumn()
//     deletedAt: Date;
  
//     // *relations
  
//     @ManyToOne(() => PhoneCode, (phoneCode) => phoneCode.users)
//     @JoinColumn({ name: 'phoneCodeId' })
//     phoneCode: PhoneCode;
//   }
  

  import { Product } from 'src/product/entities/product.entity';
import { Column, ManyToMany } from 'typeorm';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { Product } from '../../product/entities/product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  middleName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  //relation

  @ManyToMany(() => Product, (product) => product.cartProducts)
  products: Product[];

  // @ManyToOne(() => User, (user) => user.carts)
  // user: User;

  // @OneToMany(() => Order, (order) => order.user)
  // orders: Order[];
}
