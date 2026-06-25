import { CartLine } from '@/entities/cart';
import { getAppDb } from '@/shared/lib/storage';

type CartLineRow = {
  id: string;
  option_id: string;
  product_id: string;
  quantity: number;
};

export async function loadCartLines(): Promise<CartLine[]> {
  const db = await getAppDb();
  const rows = await db.getAllAsync<CartLineRow>(
    `SELECT id, product_id, option_id, quantity
     FROM cart_lines
     ORDER BY updated_at ASC`
  );

  return rows.map((row) => ({
    id: row.id,
    optionId: row.option_id,
    productId: row.product_id,
    quantity: row.quantity,
  }));
}

export async function saveCartLines(lines: CartLine[]) {
  const db = await getAppDb();

  await db.runAsync('DELETE FROM cart_lines');

  for (const line of lines) {
    await db.runAsync(
      `INSERT INTO cart_lines (id, product_id, option_id, quantity, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      line.id,
      line.productId,
      line.optionId,
      line.quantity,
      new Date().toISOString()
    );
  }
}
