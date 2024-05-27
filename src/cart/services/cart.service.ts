import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartDto } from '../dto/cart.dto';
import { UpdateCartDto } from '../dto/updateCart.dto';
import { CartProduct } from 'src/cart-product/entities/cartProduct.entity';
import { throwBadRequest } from 'src/helpers/general';
import { AuthTokenPayload } from 'src/lib/types';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class CartService {
  private dbManager: EntityManager;
  constructor(private readonly datasource: DataSource) {
    this.dbManager = datasource.manager;
  }

  async createCart(
    authPayload: AuthTokenPayload,
    cartDto: CartDto,
  ): Promise<Cart> {
    const { userData } = authPayload;

    const cartItems = cartDto.cartItems;

    let totalPrice = 0;
    let totalItems = 0;

    let cartProductsarray: CartProduct[] = [];
    // validate that the products exist
    for await (const productItem of cartItems) {
      const product = await this.dbManager.findOne(Product, {
        where: { id: productItem.productId },
      });

      if (!product) {
        throw new BadRequestException('One or more product id are invalid');
      }

      const newCartProduct = new CartProduct();
      newCartProduct.productId = product.id;
      newCartProduct.price = product.price;
      newCartProduct.quantity = productItem.quantity;
      newCartProduct.image = 'new image';

      cartProductsarray.push(newCartProduct);

      totalItems = totalItems + 1;
      totalPrice = totalPrice + Number(product.price);
    }
    // Create a new instance of Cart
    let newCart = this.dbManager.create(Cart, {
      userId: userData.id,
      totalPrice: String(totalPrice),
      totalItems: totalItems,
    });

    await this.dbManager.transaction(async (transactionManager) => {
      newCart = await transactionManager.save(newCart);

      cartProductsarray = cartProductsarray.map((cartProduct) => {
        cartProduct.cartId = newCart.id;
        return cartProduct;
      });

      await transactionManager.save(cartProductsarray);
    });

    const cart = await this.dbManager.findOne(Cart, {
      where: { id: newCart.id },
      relations: {
        cartProducts: true,
      },
    });
    if (!cart) {
      throwBadRequest('Cart doesn"t exist');
    }
    return cart;
  }
  async getCart(cartId: string): Promise<Cart> {
    const cart = await this.dbManager.findOne(Cart, {
      where: { id: cartId },
      relations: {
        cartProducts: true,
      },
    });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }

  async getAllCarts(): Promise<Cart[]> {
    const cart = await this.dbManager.find(Cart);
    return cart;
  }

  async updateCart(
    cartId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    const existingCart = await this.dbManager.findOne(Cart, {
      where: { id: cartId },
      relations: {
        cartProducts: true,
      },
    });

    if (!existingCart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    }

    const { cartItems } = updateCartDto;

    for await (const productItem of cartItems) {
      const product = await this.dbManager.findOne(Product, {
        where: { id: productItem.productId },
      });

      if (!product) {
        throw new BadRequestException('One or more product IDs are invalid');
      }

      const existingCartProduct = existingCart.cartProducts.find(
        (cp) => cp.productId === product.id,
      );

      if (!existingCartProduct) {
        //
        // throwBadRequest('Invalid product reference.');

        let newCartProduct = new CartProduct();
        newCartProduct.price = product.price;
        newCartProduct.productId = product.id;
        newCartProduct.quantity = productItem.quantity;
        newCartProduct.cartId = existingCart.id;
        newCartProduct.image = 'any image';

        newCartProduct = await this.dbManager.save(newCartProduct);

        existingCart.totalItems++;
        existingCart.totalPrice += Number(product.price) * productItem.quantity;
      }
      // updating quantity in the existingCartProduct

      // deduct price of cartproduct before update
      existingCart.totalPrice = String(
        Number(existingCart.totalPrice) -
          Number(existingCartProduct.price) * existingCartProduct.quantity,
      );
      existingCartProduct.quantity = productItem.quantity;

      existingCart.totalPrice = String(
        Number(existingCart.totalPrice) +
          Number(existingCartProduct.price) * existingCartProduct.quantity,
      );
      await this.dbManager.save(existingCartProduct);
    }

    const updatedCart = await this.dbManager.save(existingCart);
    return updatedCart;
  }
}
