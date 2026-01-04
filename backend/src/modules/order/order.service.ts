import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { CartService } from '../cart/cart.service';
import { OrderDto } from './dto/order.dto';
import { OrderStatus } from './entity/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
  ) {}

  async createOrder(userId: number): Promise<OrderDto> {
    const cart = await this.cartService.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const order = this.orderRepository.create({
      userId,
      totalAmount: cart.totalAmount,
      status: OrderStatus.PENDING,
      items: cart.items.map((cartItem) => {
        return this.orderItemRepository.create({
          productId: cartItem.product.id,
          quantity: cartItem.quantity,
          priceAtPurchase: cartItem.product.price,
        });
      }),
    });

    const savedOrder = await this.orderRepository.save(order);

    await this.cartService.clearCart(userId);

    const reloadedOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product'],
    });

    if (!reloadedOrder) {
      throw new NotFoundException('Order not found after creation');
    }

    return OrderDto.fromEntity(reloadedOrder);
  }

  async getOrders(userId: number): Promise<OrderDto[]> {
    const orders = await this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => OrderDto.fromEntity(order));
  }

  async getOrderById(userId: number, orderId: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return OrderDto.fromEntity(order);
  }
}
