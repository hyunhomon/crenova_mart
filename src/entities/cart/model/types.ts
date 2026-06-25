import { Product } from '@/entities/product';

export type CartLine = {
  id: string;
  optionId: string;
  productId: string;
  quantity: number;
};

export type CartProduct = CartLine & {
  product: Product;
  unitPrice: number;
};

export type CartSummary = {
  deliveryFee: number;
  itemCount: number;
  subtotal: number;
  total: number;
};
