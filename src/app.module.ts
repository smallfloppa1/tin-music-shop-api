import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entity/user.entity';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'appuser',
      password: 'apppassword',
      database: 'appdb',
      entities: [User],
      synchronize: true,
    }),

    UserModule,
  ],
})
export class AppModule {}
