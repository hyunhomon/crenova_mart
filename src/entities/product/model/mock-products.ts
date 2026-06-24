import { Product, ProductCategory } from './types';

export const productCategories: ProductCategory[] = [
  'all',
  'light-stick',
  'album',
  'apparel',
  'photo-card',
  'goods',
];

export const mockProducts: Product[] = [
  {
    id: 'product-ls-001',
    artist: 'LUMINA',
    category: 'light-stick',
    delivery: {
      badgeLabel: '오늘 도착',
      fee: 0,
      kind: 'rocket',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
    name: 'LUMINA 공식 응원봉 ver.3',
    options: [
      { id: 'option-default', name: '기본 패키지', priceDelta: 0 },
      { id: 'option-battery', name: '건전지 포함', priceDelta: 2500 },
    ],
    price: 59000,
    reviewCount: 1842,
    stock: 42,
    tags: ['공식', '무료배송'],
  },
  {
    id: 'product-album-001',
    artist: 'NOVA9',
    category: 'album',
    delivery: {
      badgeLabel: '내일 도착',
      fee: 0,
      kind: 'rocket',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
    listPrice: 24200,
    name: 'NOVA9 미니 4집 포토북반',
    options: [
      { id: 'cover-random', name: '커버 랜덤', priceDelta: 0 },
      { id: 'cover-set', name: '커버 2종 세트', priceDelta: 19800 },
    ],
    price: 21800,
    reviewCount: 932,
    stock: 128,
    tags: ['초동반영', '포토카드'],
  },
  {
    id: 'product-hoodie-001',
    artist: 'ATEAM',
    category: 'apparel',
    delivery: {
      badgeLabel: '무료배송',
      fee: 0,
      kind: 'standard',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
    name: 'ATEAM 투어 후드 집업',
    options: [
      { id: 'size-m', name: 'M', priceDelta: 0 },
      { id: 'size-l', name: 'L', priceDelta: 0 },
      { id: 'size-xl', name: 'XL', priceDelta: 0 },
    ],
    price: 89000,
    reviewCount: 314,
    stock: 25,
    tags: ['투어굿즈'],
  },
  {
    id: 'product-card-001',
    artist: 'LUMINA',
    category: 'photo-card',
    delivery: {
      badgeLabel: '오늘 도착',
      fee: 0,
      kind: 'rocket',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1520975682031-a7a7f2a0bd2a?auto=format&fit=crop&w=900&q=80',
    name: 'LUMINA 랜덤 포토카드 5팩',
    options: [{ id: 'pack-5', name: '5팩', priceDelta: 0 }],
    price: 16500,
    reviewCount: 640,
    stock: 210,
    tags: ['랜덤', '인기'],
  },
  {
    id: 'product-goods-001',
    artist: 'NOVA9',
    category: 'goods',
    delivery: {
      badgeLabel: '예약배송',
      fee: 3000,
      kind: 'preorder',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    name: 'NOVA9 데스크 매트',
    options: [{ id: 'desk-mat', name: '단품', priceDelta: 0 }],
    price: 32000,
    reviewCount: 87,
    stock: 60,
    tags: ['예약'],
  },
];

export const featuredProducts = mockProducts.slice(0, 3);
