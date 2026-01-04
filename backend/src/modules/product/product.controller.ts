import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  getById(@Param('id') id: number): Promise<Product> {
    return this.productService.getById(id);
  }
}
