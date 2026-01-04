import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createProduct(@Body() product: CreateProductDto): Promise<ProductDto> {
    return this.productService.createProduct(product);
  }

  @Get('category/:categoryName')
  async getAllByCategory(
    @Param('categoryName') category: string,
  ): Promise<ProductDto[]> {
    return this.productService.getAllByCategory(category);
  }

  @Get(':id')
  async getById(@Param('id') id: number): Promise<ProductDto> {
    return this.productService.getById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateProduct(
    @Param('id') id: number,
    @Body() product: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.productService.updateProduct(id, product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
