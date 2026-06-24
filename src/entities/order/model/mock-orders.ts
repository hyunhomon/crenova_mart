import { Product } from '@/entities/product';

import { Order } from './types';

export function createMockOrders(products: Product[]): Order[] {
  const [first, second, third] = products;

  return [
    {
      createdAt: '2026-06-25T09:30:00+09:00',
      id: 'order-001',
      items: [
        {
          id: 'order-item-001',
          productId: first.id,
          productName: first.name,
          quantity: 1,
          unitPrice: first.price,
        },
      ],
      orderNumber: 'FD-20260625-001',
      payment: {
        approvedAt: '2026-06-25T09:31:00+09:00',
        method: 'toss-payments-card',
        totalAmount: first.price + first.delivery.fee,
      },
      status: 'shipping',
    },
    {
      createdAt: '2026-06-23T16:10:00+09:00',
      id: 'order-002',
      items: [
        {
          id: 'order-item-002',
          productId: second.id,
          productName: second.name,
          quantity: 2,
          unitPrice: second.price,
        },
      ],
      orderNumber: 'FD-20260623-002',
      payment: {
        approvedAt: '2026-06-23T16:11:00+09:00',
        method: 'toss-payments-card',
        totalAmount: second.price * 2 + second.delivery.fee,
      },
      status: 'delivered',
    },
    {
      createdAt: '2026-06-19T12:24:00+09:00',
      id: 'order-003',
      items: [
        {
          id: 'order-item-003',
          productId: third.id,
          productName: third.name,
          quantity: 1,
          unitPrice: third.price,
        },
      ],
      orderNumber: 'FD-20260619-003',
      payment: {
        approvedAt: '2026-06-19T12:25:00+09:00',
        method: 'toss-payments-transfer',
        totalAmount: third.price + third.delivery.fee,
      },
      status: 'delivered',
    },
  ];
}
