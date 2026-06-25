import { createContext, use, useMemo, useState, type ReactNode } from 'react';

import { CartLine, buildCartItems, calculateCartSummary } from '@/entities/cart';
import { mockProducts } from '@/entities/product';

type AddCartItemInput = {
  optionId: string;
  productId: string;
  quantity: number;
};

type CartStore = {
  addItem: (input: AddCartItemInput) => void;
  clearCart: () => void;
  items: ReturnType<typeof buildCartItems>;
  lines: CartLine[];
  removeItem: (lineId: string) => void;
  summary: ReturnType<typeof calculateCartSummary>;
  updateQuantity: (lineId: string, quantity: number) => void;
};

const CartContext = createContext<CartStore | null>(null);
let cartLinesState: CartLine[] = [];

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [lines, setLinesState] = useState<CartLine[]>(cartLinesState);
  const items = useMemo(() => buildCartItems(lines, mockProducts), [lines]);
  const summary = useMemo(() => calculateCartSummary(items), [items]);

  function setLines(updater: (currentLines: CartLine[]) => CartLine[]) {
    setLinesState((currentLines) => {
      const nextLines = updater(currentLines);
      cartLinesState = nextLines;

      return nextLines;
    });
  }

  const store = useMemo<CartStore>(
    () => ({
      addItem(input) {
        setLines((currentLines) => {
          const existingLine = currentLines.find(
            (line) => line.productId === input.productId && line.optionId === input.optionId
          );

          if (!existingLine) {
            return [
              ...currentLines,
              {
                id: createCartLineId(input.productId, input.optionId),
                optionId: input.optionId,
                productId: input.productId,
                quantity: clampQuantity(input.quantity),
              },
            ];
          }

          return currentLines.map((line) =>
            line.id === existingLine.id
              ? {
                  ...line,
                  quantity: clampQuantity(line.quantity + input.quantity),
                }
              : line
          );
        });
      },
      clearCart() {
        setLines(() => []);
      },
      items,
      lines,
      removeItem(lineId) {
        setLines((currentLines) => currentLines.filter((line) => line.id !== lineId));
      },
      summary,
      updateQuantity(lineId, quantity) {
        setLines((currentLines) =>
          currentLines.map((line) =>
            line.id === lineId
              ? {
                  ...line,
                  quantity: clampQuantity(quantity),
                }
              : line
          )
        );
      },
    }),
    [items, lines, summary]
  );

  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}

export function useCart() {
  const store = use(CartContext);

  if (!store) {
    throw new Error('CartProvider is missing.');
  }

  return store;
}

function clampQuantity(quantity: number) {
  return Math.max(1, Math.min(99, quantity));
}

function createCartLineId(productId: string, optionId: string) {
  return `${productId}:${optionId}`;
}
