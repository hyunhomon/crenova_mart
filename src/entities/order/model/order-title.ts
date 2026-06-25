import { OrderItem } from './types';

export function formatOrderTitle(items: OrderItem[]) {
  const [firstItem] = items;

  if (!firstItem) {
    return '주문 상품';
  }

  if (items.length === 1) {
    return firstItem.productName;
  }

  return `${firstItem.productName} 외 ${items.length - 1}건`;
}
