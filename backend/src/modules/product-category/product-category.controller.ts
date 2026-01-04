import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ProductCategoryDto } from './dto/product-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Body() category: CreateCategoryDto,
  ): Promise<ProductCategoryDto> {
    return this.productCategoryService.createCategory(category);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateCategory(
    @Param('id') id: number,
    @Body() category: UpdateCategoryDto,
  ): Promise<ProductCategoryDto> {
    return this.productCategoryService.updateCategory(id, category);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return this.productCategoryService.deleteCategory(id);
  }
}
