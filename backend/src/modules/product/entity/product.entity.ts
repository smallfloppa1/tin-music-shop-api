import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { OrderItem } from '../../order/entity/order-item.entity';
import { ProductCategory } from '../../product-category/entity/product-category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  categoryId?: number;

  @ManyToOne(
    () => ProductCategory,
    (productCategory) => productCategory.products,
    { onDelete: 'SET NULL', nullable: true },
  )
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
