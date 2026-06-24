import { CartProduct } from '@/entities/cart';

import { savePendingTossPayment } from './pending-payment';

type TossPaymentsFactory = (clientKey: string) => {
  payment: (params: { customerKey: string }) => {
    requestPayment: (params: TossCardPaymentRequest) => Promise<void>;
  };
};

type TossCardPaymentRequest = {
  amount: {
    currency: 'KRW';
    value: number;
  };
  customerEmail: string;
  customerName: string;
  failUrl: string;
  method: 'CARD';
  orderId: string;
  orderName: string;
  successUrl: string;
  windowTarget: 'self';
};

declare global {
  interface Window {
    TossPayments?: TossPaymentsFactory;
  }
}

const tossSdkUrl = 'https://js.tosspayments.com/v2/standard';
const tossAnonymousCustomerKey = 'ANONYMOUS';

export function getTossClientKey() {
  return process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY;
}

export function buildTossOrderName(items: CartProduct[]) {
  const [firstItem] = items;

  if (!firstItem) {
    return '팬덤& 주문';
  }

  if (items.length === 1) {
    return firstItem.product.name;
  }

  return `${firstItem.product.name} 외 ${items.length - 1}건`;
}

export async function requestTossCardPayment({
  amount,
  clientKey,
  items,
  orderName,
}: {
  amount: number;
  clientKey: string;
  items: CartProduct[];
  orderName: string;
}) {
  if (typeof window === 'undefined') {
    throw new Error('웹 테스트 환경에서 결제를 실행해 주세요.');
  }

  const TossPayments = await loadTossPayments();
  const orderId = createOrderId();
  const origin = window.location.origin;

  savePendingTossPayment({
    amount,
    items: items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    orderId,
    orderName,
  });

  await TossPayments(clientKey).payment({ customerKey: tossAnonymousCustomerKey }).requestPayment({
    amount: {
      currency: 'KRW',
      value: amount,
    },
    customerEmail: 'fan@example.com',
    customerName: '김팬덤',
    failUrl: `${origin}/checkout/fail`,
    method: 'CARD',
    orderId,
    orderName,
    successUrl: `${origin}/checkout/success?expectedAmount=${amount}`,
    windowTarget: 'self',
  });
}

function loadTossPayments() {
  if (window.TossPayments) {
    return Promise.resolve(window.TossPayments);
  }

  return new Promise<TossPaymentsFactory>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${tossSdkUrl}"]`);

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.TossPayments) {
          resolve(window.TossPayments);
        }
      });
      existingScript.addEventListener('error', () => reject(new Error('결제 모듈을 불러오지 못했어요.')));
      return;
    }

    const script = document.createElement('script');
    script.src = tossSdkUrl;
    script.async = true;
    script.addEventListener('load', () => {
      if (!window.TossPayments) {
        reject(new Error('결제 모듈을 시작하지 못했어요.'));
        return;
      }

      resolve(window.TossPayments);
    });
    script.addEventListener('error', () => reject(new Error('결제 모듈을 불러오지 못했어요.')));
    document.head.appendChild(script);
  });
}

function createOrderId() {
  const entropy = Math.random().toString(36).slice(2, 10);

  return `FD-${Date.now()}-${entropy}`;
}
