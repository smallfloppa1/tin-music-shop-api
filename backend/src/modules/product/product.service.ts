import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductCategory } from '../product-category/entity/product-category.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async createProduct(product: CreateProductDto): Promise<ProductDto> {
    if (product.categoryId) {
      const categoryExists = await this.productCategoryRepository.existsBy({
        id: product.categoryId,
      });
      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }
    }

    const newProduct = this.productRepository.create({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
    });

    const savedProduct = await this.productRepository.save(newProduct);

    return ProductDto.fromEntity(savedProduct);
  }

  async getAllByCategory(category: string): Promise<ProductDto[]> {
    const products = await this.productRepository.find({
      where: {
        category: {
          slug: category,
        },
      },
      relations: ['category'],
    });

    return products.map((product) => ProductDto.fromEntity(product));
  }

  async getById(id: number): Promise<ProductDto> {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return ProductDto.fromEntity(product);
  }

  async updateProduct(
    id: number,
    product: UpdateProductDto,
  ): Promise<ProductDto> {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (product.categoryId) {
      const categoryExists = await this.productCategoryRepository.existsBy({
        id: product.categoryId,
      });
      if (!categoryExists) {
        throw new NotFoundException('Category not found');
      }
    }

    const updatedProduct = this.productRepository.merge(
      existingProduct,
      product,
    );
    const savedProduct = await this.productRepository.save(updatedProduct);

    return ProductDto.fromEntity(savedProduct);
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }
}
