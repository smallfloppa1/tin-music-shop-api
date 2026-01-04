import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductCategory } from '../product-category/entity/product-category.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategory]), AuthModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
