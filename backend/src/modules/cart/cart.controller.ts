import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartDto } from './dto/cart.dto';
import { AuthGuard } from '../auth/auth.guard';
import { type RequestWithUser } from '../auth/type/request-with-user.interface';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req: RequestWithUser): Promise<CartDto> {
    return this.cartService.getCart(req.user.sub);
  }

  @Post()
  async addToCart(
    @Request() req: RequestWithUser,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartDto> {
    return this.cartService.addToCart(req.user.sub, addToCartDto);
  }

  @Delete(':itemId')
  async removeFromCart(
    @Request() req: RequestWithUser,
    @Param('itemId') itemId: number,
  ): Promise<CartDto> {
    return this.cartService.removeFromCart(req.user.sub, itemId);
  }

  @Delete()
  async clearCart(@Request() req: RequestWithUser): Promise<void> {
    return this.cartService.clearCart(req.user.sub);
  }
}
