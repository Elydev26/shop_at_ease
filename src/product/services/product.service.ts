import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, ILike } from 'typeorm';
import { ProductDto } from '../dto/product.dto';
import { Product } from '../entities/product.entity';
//import { WhereClause } from 'typeorm/query-builder/WhereClause';

@Injectable()
export class ProductService {
  private dbManager: EntityManager;
  constructor(private readonly datasource: DataSource) {
    this.dbManager = datasource.manager;
  }

  async create(product: ProductDto): Promise<Product> {
    const newProduct = this.dbManager.create(Product, product);
    const saveProduct = await this.dbManager.save(newProduct);
    return saveProduct;
  }

  async all_product(): Promise<Product[]> {
    const product = await this.dbManager.find(Product);
    return product;
  }

  async getProductDetails(productId: string): Promise<Product> {
    const product = await this.dbManager.findOne(Product, {
      where: { id: productId },
    });
    return product;
  }

  async searchProducts(searchQuery: string): Promise<Product[]> {
    const products = await this.dbManager.find(Product, {
      where: [
        { name: ILike(`%${searchQuery}%`) },
        { brand: ILike(`%${searchQuery}%`) },
        { tag: ILike(`%${searchQuery}%`) },
        { productCategory: searchQuery as any },
      ],
    });

    return products;
  }

  async filterProducts(
    filterParams: any,
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; total: number }> {
    const whereClause: any = {};

    if (filterParams.brand || filterParams.name) {
      whereClause.name = filterParams.name;
      whereClause.brand = filterParams.brand;
    }
    if (filterParams.price && filterParams.tag) {
      whereClause.price = filterParams.price;
      whereClause.tag = filterParams.tag;
    } else if (filterParams.price) {
      whereClause.price = filterParams.price;
    } else if (filterParams.tag) {
      whereClause.tag = filterParams.tag;
    }

    const [products, total] = await this.dbManager.findAndCount(Product, {
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
    });

    return { products, total };
  }
}
