import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entity/user.entity';
import { UserModule } from './modules/user/user.module';
import { Order } from './modules/order/entity/order.entity';
import { Product } from './modules/product/entity/product.entity';
import { OrderItem } from './modules/order/entity/order-item.entity';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'appuser',
      password: 'apppassword',
      database: 'appdb',
      entities: [User, Order, Product, OrderItem],
      synchronize: true,
    }),

    UserModule,
    ProductModule,
    OrderModule,
  ],
})
export class AppModule {}
