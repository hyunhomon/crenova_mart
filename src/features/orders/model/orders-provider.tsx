import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { createMockOrders, Order } from '@/entities/order';
import { mockProducts } from '@/entities/product';

import { loadOrdersFromDb, saveOrderToDb, seedOrdersIfEmpty } from './orders-repository';
import { OrderStatusFilter } from './orders';

type OrdersStore = {
  addOrder: (order: Order) => Promise<void>;
  getOrderById: (orderId?: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatusFilter) => Order[];
  isReady: boolean;
  orders: Order[];
  refreshOrders: () => Promise<void>;
};

const OrdersContext = createContext<OrdersStore | null>(null);

type OrdersProviderProps = {
  children: ReactNode;
};

export function OrdersProvider({ children }: OrdersProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshOrders = useCallback(async () => {
    const storedOrders = await loadOrdersFromDb();

    setOrders(storedOrders);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function setupOrders() {
      try {
        await seedOrdersIfEmpty(createMockOrders(mockProducts));
        const storedOrders = await loadOrdersFromDb();

        if (mounted) {
          setOrders(storedOrders);
        }
      } catch (error) {
        console.error('Failed to load orders.', error);
      } finally {
        if (mounted) {
          setIsReady(true);
        }
      }
    }

    void setupOrders();

    return () => {
      mounted = false;
    };
  }, []);

  const addOrder = useCallback(async (order: Order) => {
    setOrders((currentOrders) => {
      const nextOrders = [order, ...currentOrders.filter((item) => item.id !== order.id)];

      return sortOrders(nextOrders);
    });

    await saveOrderToDb(order);
  }, []);

  const store = useMemo<OrdersStore>(
    () => ({
      addOrder,
      getOrderById(orderId) {
        return orders.find((order) => order.id === orderId);
      },
      getOrdersByStatus(status) {
        return orders.filter((order) =>
          status === 'delivered' ? order.status === 'delivered' : order.status !== 'delivered'
        );
      },
      isReady,
      orders,
      refreshOrders,
    }),
    [addOrder, isReady, orders, refreshOrders]
  );

  return <OrdersContext.Provider value={store}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const store = use(OrdersContext);

  if (!store) {
    throw new Error('OrdersProvider is missing.');
  }

  return store;
}

function sortOrders(orders: Order[]) {
  return [...orders].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}
