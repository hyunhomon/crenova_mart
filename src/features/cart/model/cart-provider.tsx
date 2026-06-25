import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { CartLine, buildCartItems, calculateCartSummary } from '@/entities/cart';
import { mockProducts } from '@/entities/product';

import { loadCartLines, saveCartLines } from './cart-repository';

type AddCartItemInput = {
  optionId: string;
  productId: string;
  quantity: number;
};

type CartStore = {
  addItem: (input: AddCartItemInput) => void;
  clearCart: () => void;
  isReady: boolean;
  items: ReturnType<typeof buildCartItems>;
  lines: CartLine[];
  removeItem: (lineId: string) => void;
  summary: ReturnType<typeof calculateCartSummary>;
  updateQuantity: (lineId: string, quantity: number) => void;
};

const CartContext = createContext<CartStore | null>(null);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [lines, setLinesState] = useState<CartLine[]>([]);
  const writeQueueRef = useRef(Promise.resolve());
  const items = useMemo(() => buildCartItems(lines, mockProducts), [lines]);
  const summary = useMemo(() => calculateCartSummary(items), [items]);

  useEffect(() => {
    let mounted = true;

    loadCartLines()
      .then((storedLines) => {
        if (mounted) {
          setLinesState(storedLines);
        }
      })
      .catch((error) => {
        console.error('Failed to load cart lines.', error);
      })
      .finally(() => {
        if (mounted) {
          setIsReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const persistLines = useCallback((nextLines: CartLine[]) => {
    writeQueueRef.current = writeQueueRef.current
      .then(() => saveCartLines(nextLines))
      .catch((error) => {
        console.error('Failed to save cart lines.', error);
      });
  }, []);

  const setLines = useCallback((updater: (currentLines: CartLine[]) => CartLine[]) => {
    setLinesState((currentLines) => {
      const nextLines = updater(currentLines);
      persistLines(nextLines);

      return nextLines;
    });
  }, [persistLines]);

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
      isReady,
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
    [isReady, items, lines, setLines, summary]
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
