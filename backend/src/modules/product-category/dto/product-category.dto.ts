import { ProductCategory } from '../entity/product-category.entity';

export class ProductCategoryDto {
  id: number;
  name: string;
  slug: string;
  parentId: number;

  static fromEntity(entity: ProductCategory): ProductCategoryDto {
    const dto = new ProductCategoryDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.slug = entity.slug;
    dto.parentId = entity.parentId;
    return dto;
  }
}
