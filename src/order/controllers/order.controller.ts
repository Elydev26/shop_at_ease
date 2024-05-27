import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderDto } from '../dto/order.dto';
import { Order } from '../entities/order.entity';
import { OrderService } from '../services/order.service';

//import { CartService } from '@/cart/cart.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('view-all-order')
  async allOrder(): Promise<Order[]> {
    const allOrder = await this.orderService.getAllOrders();
    return allOrder;
  }
  @Get('order-by-id/:id')
  async orderByCartId(@Param('id') cartId: string) {
    const findCart = await this.orderService.getOrderId(cartId);
    return findCart;
  }
  @Get('order-details/:cartId')
  async orderDetails(@Param('cartId') cartId: string) {
    const findOrderDetails = await this.orderService.getOrderDetails(cartId);
    return findOrderDetails;
  }

  @Post('create-order')
  async createOrder(@Body() orderDto: OrderDto) {
    const { cartId } = orderDto;
    const newOrder = await this.orderService.createOrder(orderDto, cartId);
    return newOrder;
  }
}
