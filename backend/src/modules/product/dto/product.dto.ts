import { Product } from '../entity/product.entity';

export class ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryName?: string;

  static fromEntity(entity: Product): ProductDto {
    const dto = new ProductDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.price = entity.price;
    dto.stock = entity.stock;
    dto.imageUrl = entity.imageUrl;
    dto.categoryName = entity.category?.name;
    return dto;
  }
}
