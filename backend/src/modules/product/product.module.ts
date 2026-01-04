import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductCategory } from './entity/product-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
