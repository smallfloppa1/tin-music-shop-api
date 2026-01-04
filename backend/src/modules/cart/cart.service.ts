import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entity/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entity/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartDto } from './dto/cart.dto';
import { Product } from '../product/entity/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getCart(userId: number): Promise<CartDto> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product', 'items.product.category'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
      await this.cartRepository.save(cart);
    }

    this.calculateTotal(cart);
    return CartDto.fromEntity(cart);
  }

  async addToCart(
    userId: number,
    addToCartDto: AddToCartDto,
  ): Promise<CartDto> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
      await this.cartRepository.save(cart);
    }

    const product = await this.productRepository.findOne({
      where: { id: addToCartDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cartItem = cart.items.find(
      (item) => item.productId === addToCartDto.productId,
    );

    if (cartItem) {
      cartItem.quantity += addToCartDto.quantity;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity: addToCartDto.quantity,
      });
      cart.items.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);

    const reloadedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.product', 'items.product.category'],
    });

    if (!reloadedCart) {
      throw new NotFoundException('Cart not found');
    }

    this.calculateTotal(reloadedCart);
    await this.cartRepository.save(reloadedCart);

    return CartDto.fromEntity(reloadedCart);
  }

  async removeFromCart(userId: number, cartItemId: number): Promise<CartDto> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product', 'items.product.category'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex((item) => item.id == cartItemId);
    if (itemIndex > -1) {
      const itemToRemove = cart.items[itemIndex];
      cart.items.splice(itemIndex, 1);
      await this.cartItemRepository.remove(itemToRemove);
    } else {
      throw new NotFoundException('Item not found in cart');
    }

    this.calculateTotal(cart);
    await this.cartRepository.save(cart);

    return CartDto.fromEntity(cart);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });

    if (cart) {
      await this.cartItemRepository.remove(cart.items);
      cart.items = [];
      cart.totalAmount = 0;
      await this.cartRepository.save(cart);
    }
  }

  private calculateTotal(cart: Cart) {
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  }
}
