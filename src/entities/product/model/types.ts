export type ProductCategory = 'all' | 'light-stick' | 'album' | 'apparel' | 'photo-card' | 'goods';

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
