// import { Product } from '../../product/entities/product.entity';
// import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

// @Entity()
// export class Product_Details {
//   @PrimaryColumn({ type: 'bigint' })
//   productId: string;

//   @Column({ type: 'varchar', nullable: true })
//   specification: string;

//   @Column({ type: 'varchar', nullable: true })
//   colour: string;

//   @Column({ type: 'bigint', nullable: true })
//   size: string;

//   @Column({ type: 'bigint', nullable: true })
//   weight: number;

//   //relation

//   @OneToOne(() => Product, (product) => product.product_details)
//   product: Product;
// }
