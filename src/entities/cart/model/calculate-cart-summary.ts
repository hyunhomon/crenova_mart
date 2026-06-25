import { Product } from '@/entities/product';

import { CartLine, CartProduct, CartSummary } from './types';

export function buildCartItems(lines: CartLine[], products: Product[]): CartProduct[] {
  const productById = new Map(products.map((product) => [product.id, product]));

  return lines.flatMap((line) => {
    const product = productById.get(line.productId);
    if (!product) {
      return [];
    }

    const option = product.options.find((item) => item.id === line.optionId);
    const unitPrice = product.price + (option?.priceDelta ?? 0);

    return [
      {
        ...line,
        product,
        unitPrice,
      },
    ];
  });
}

export function calculateCartSummary(items: CartProduct[]): CartSummary {
  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const deliveryFee = items.reduce((total, item) => total + item.product.delivery.fee, 0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return {
    deliveryFee,
    itemCount,
    subtotal,
    total: subtotal + deliveryFee,
  };
}
