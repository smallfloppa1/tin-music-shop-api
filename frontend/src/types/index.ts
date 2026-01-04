export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponseDto {
  accessToken: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
}

export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryName: string;
}

export interface ProductCategoryDto {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
}

export interface CartItemDto {
  id: number;
  quantity: number;
  product: ProductDto;
}

export interface CartDto {
  id: number;
  totalAmount: number;
  items: CartItemDto[];
}

export interface AddToCartDto {
  productId: number;
  quantity: number;
}

export interface OrderItemDto {
  id: number;
  priceAtPurchase: number;
  quantity: number;
  product: ProductDto;
}

export interface OrderDto {
  id: number;
  totalAmount: number;
  status: 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
  items: OrderItemDto[];
}
