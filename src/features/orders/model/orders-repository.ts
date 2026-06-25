import { PaymentMethod } from '@/entities/checkout';
import { DeliveryStatus, Order, OrderItem } from '@/entities/order';
import { getAppDb } from '@/shared/lib/storage';

type OrderRow = {
  created_at: string;
  id: string;
  order_number: string;
  payment_approved_at: string;
  payment_key: string | null;
  payment_method: string;
  status: DeliveryStatus;
  total_amount: number;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
};

export async function loadOrdersFromDb(): Promise<Order[]> {
  const db = await getAppDb();

  await removeEmptyOrders(db);

  const orderRows = await db.getAllAsync<OrderRow>(
    `SELECT id, order_number, status, created_at, payment_approved_at, payment_method,
            payment_key, total_amount
     FROM orders
     ORDER BY created_at DESC`
  );
  const itemRows = await db.getAllAsync<OrderItemRow>(
    `SELECT id, order_id, product_id, product_name, quantity, unit_price
     FROM order_items
     ORDER BY id ASC`
  );
  const itemsByOrderId = groupOrderItems(itemRows);

  return orderRows
    .map((row) => ({
      createdAt: row.created_at,
      id: row.id,
      items: itemsByOrderId.get(row.id) ?? [],
      orderNumber: row.order_number,
      payment: {
        approvedAt: row.payment_approved_at,
        method: normalizePaymentMethod(row.payment_method),
        paymentKey: row.payment_key ?? undefined,
        totalAmount: row.total_amount,
      },
      status: row.status,
    }))
    .filter((order) => order.items.length > 0);
}

export async function saveOrderToDb(order: Order) {
  const db = await getAppDb();

  await db.withTransactionAsync(async () => {
    await upsertOrder(db, order);
  });
}

export async function seedOrdersIfEmpty(seedOrders: Order[]) {
  const db = await getAppDb();
  await removeEmptyOrders(db);

  const row = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) AS count FROM orders');

  if ((row?.count ?? 0) > 0) {
    return;
  }

  for (const order of seedOrders) {
    await upsertOrder(db, order);
  }
}

async function upsertOrder(db: Pick<Awaited<ReturnType<typeof getAppDb>>, 'runAsync'>, order: Order) {
  await db.runAsync(
    `INSERT OR REPLACE INTO orders (
       id, order_number, status, created_at, payment_approved_at, payment_method,
       payment_key, total_amount
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    order.id,
    order.orderNumber,
    order.status,
    order.createdAt,
    order.payment.approvedAt,
    order.payment.method,
    order.payment.paymentKey ?? null,
    order.payment.totalAmount
  );
  await db.runAsync('DELETE FROM order_items WHERE order_id = ?', order.id);

  for (const [index, item] of order.items.entries()) {
    await db.runAsync(
      `INSERT INTO order_items (
         id, order_id, product_id, product_name, quantity, unit_price
       )
       VALUES (?, ?, ?, ?, ?, ?)`,
      createOrderItemId(order.id, index),
      order.id,
      item.productId,
      item.productName,
      item.quantity,
      item.unitPrice
    );
  }
}

async function removeEmptyOrders(db: Pick<Awaited<ReturnType<typeof getAppDb>>, 'runAsync'>) {
  await db.runAsync(`
    DELETE FROM orders
    WHERE id NOT IN (
      SELECT DISTINCT order_id
      FROM order_items
    )
  `);
}

function createOrderItemId(orderId: string, index: number) {
  return `${orderId}:item:${index + 1}`;
}

function groupOrderItems(rows: OrderItemRow[]) {
  const itemMap = new Map<string, OrderItem[]>();

  for (const row of rows) {
    const orderItems = itemMap.get(row.order_id) ?? [];

    orderItems.push({
      id: row.id,
      productId: row.product_id,
      productName: row.product_name,
      quantity: row.quantity,
      unitPrice: row.unit_price,
    });

    itemMap.set(row.order_id, orderItems);
  }

  return itemMap;
}

function normalizePaymentMethod(method: string): PaymentMethod {
  if (method === 'kb-card' || method === 'kb-bank' || method === 'naver-pay') {
    return method;
  }

  if (method.endsWith('-transfer')) {
    return 'kb-bank';
  }

  return 'kb-card';
}
