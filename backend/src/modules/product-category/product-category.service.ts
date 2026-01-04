import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entity/product-category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ProductCategoryDto } from './dto/product-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async createCategory(
    category: CreateCategoryDto,
  ): Promise<ProductCategoryDto> {
    if (category.parentId) {
      const parentExists = await this.productCategoryRepository.existsBy({
        id: category.parentId,
      });

      if (!parentExists) {
        throw new BadRequestException('Parent category does not exist');
      }
    }

    const slugExists = await this.productCategoryRepository.existsBy({
      slug: category.slug,
    });

    if (slugExists) {
      throw new ConflictException('Category with this slug already exists');
    }

    const newCategory = this.productCategoryRepository.create({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId,
    });

    const savedCategory =
      await this.productCategoryRepository.save(newCategory);

    return ProductCategoryDto.fromEntity(savedCategory);
  }

  async getAllCategories(): Promise<ProductCategoryDto[]> {
    const categories = await this.productCategoryRepository.find();
    return categories.map((category) =>
      ProductCategoryDto.fromEntity(category),
    );
  }

  async updateCategory(
    id: number,
    category: UpdateCategoryDto,
  ): Promise<ProductCategoryDto> {
    const existingCategory = await this.productCategoryRepository.findOne({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    if (category.parentId) {
      const parentExists = await this.productCategoryRepository.existsBy({
        id: category.parentId,
      });

      if (!parentExists) {
        throw new BadRequestException('Parent category does not exist');
      }
    }

    if (category.slug && category.slug !== existingCategory.slug) {
      const slugExists = await this.productCategoryRepository.existsBy({
        slug: category.slug,
      });

      if (slugExists) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    const updatedCategory = this.productCategoryRepository.merge(
      existingCategory,
      category,
    );
    const savedCategory =
      await this.productCategoryRepository.save(updatedCategory);

    return ProductCategoryDto.fromEntity(savedCategory);
  }

  async deleteCategory(id: number): Promise<void> {
    const result = await this.productCategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
  }
}
