import { CartItem } from '../entity/cart-item.entity';
import { ProductDto } from '../../product/dto/product.dto';

export class CartItemDto {
  id: number;
  quantity: number;
  product: ProductDto;

  static fromEntity(entity: CartItem): CartItemDto {
    const dto = new CartItemDto();
    dto.id = entity.id;
    dto.quantity = entity.quantity;
    if (entity.product) {
      dto.product = ProductDto.fromEntity(entity.product);
    }
    return dto;
  }
}
