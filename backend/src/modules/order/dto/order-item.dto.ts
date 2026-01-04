import { OrderItem } from '../entity/order-item.entity';
import { ProductDto } from '../../product/dto/product.dto';

export class OrderItemDto {
  id: number;
  priceAtPurchase: number;
  quantity: number;
  product: ProductDto;

  static fromEntity(entity: OrderItem): OrderItemDto {
    const dto = new OrderItemDto();
    dto.id = entity.id;
    dto.priceAtPurchase = entity.priceAtPurchase;
    dto.quantity = entity.quantity;
    if (entity.product) {
      dto.product = ProductDto.fromEntity(entity.product);
    }
    return dto;
  }
}
