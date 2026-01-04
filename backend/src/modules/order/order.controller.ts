import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';
import { AuthGuard } from '../auth/auth.guard';
import { type RequestWithUser } from '../auth/type/request-with-user.interface';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Request() req: RequestWithUser): Promise<OrderDto> {
    return this.orderService.createOrder(req.user.sub);
  }

  @Get()
  async getOrders(@Request() req: RequestWithUser): Promise<OrderDto[]> {
    return this.orderService.getOrders(req.user.sub);
  }

  @Get(':id')
  async getOrderById(
    @Request() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<OrderDto> {
    return this.orderService.getOrderById(req.user.sub, id);
  }
}
