import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../product/entity/product.entity';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(
    () => ProductCategory,
    (productCategory) => productCategory.children,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'parent_id' })
  parent: ProductCategory;

  @OneToMany(() => ProductCategory, (productCategory) => productCategory.parent)
  children: ProductCategory[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
