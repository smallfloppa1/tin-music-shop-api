import { Cart } from '../entity/cart.entity';
import { CartItemDto } from './cart-item.dto';

export class CartDto {
  id: number;
  totalAmount: number;
  items: CartItemDto[];

  static fromEntity(entity: Cart): CartDto {
    const dto = new CartDto();
    dto.id = entity.id;
    dto.totalAmount = entity.totalAmount;
    if (entity.items) {
      dto.items = entity.items.map((item) => CartItemDto.fromEntity(item));
    } else {
      dto.items = [];
    }
    return dto;
  }
}
