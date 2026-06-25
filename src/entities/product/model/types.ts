export type ProductCategory =
  | 'all'
  | 'women-fashion'
  | 'men-fashion'
  | 'food'
  | 'fresh-food'
  | 'home-interior'
  | 'electronics'
  | 'office'
  | 'daily-goods'
  | 'beauty'
  | 'sports'
  | 'health'
  | 'baby'
  | 'kitchen'
  | 'pets'
  | 'toys-hobbies'
  | 'books-music';

export type ProductSort = 'recommended' | 'price-low' | 'price-high';

export type DeliveryProfile = {
  badgeLabel: string;
  fee: number;
  kind: 'rocket' | 'standard' | 'preorder';
};

export type ProductOption = {
  id: string;
  name: string;
  priceDelta: number;
};

export type Product = {
  artist: string;
  category: ProductCategory;
  delivery: DeliveryProfile;
  description: string;
  id: string;
  imageUrl: string;
  listPrice?: number;
  name: string;
  options: ProductOption[];
  price: number;
  reviewCount: number;
  stock: number;
  tags: string[];
};
