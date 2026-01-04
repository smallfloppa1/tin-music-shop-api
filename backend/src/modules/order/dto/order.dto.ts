import { Order } from '../entity/order.entity';
import { OrderStatus } from '../entity/order-status.enum';
import { OrderItemDto } from './order-item.dto';

export class OrderDto {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  items: OrderItemDto[];

  static fromEntity(entity: Order): OrderDto {
    const dto = new OrderDto();
    dto.id = entity.id;
    dto.totalAmount = entity.totalAmount;
    dto.status = entity.status;
    dto.createdAt = entity.createdAt;
    if (entity.items) {
      dto.items = entity.items.map((item) => OrderItemDto.fromEntity(item));
    } else {
      dto.items = [];
    }
    return dto;
  }
}
