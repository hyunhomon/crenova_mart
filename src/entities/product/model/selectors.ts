import { mockProducts } from './mock-products';
import { ProductCategory } from './types';

export const categoryLabels: Record<ProductCategory, string> = {
  album: '앨범',
  all: '전체',
  apparel: '의류',
  goods: '굿즈',
  'light-stick': '응원봉',
  'photo-card': '포토카드',
};

export function getProductsByCategory(category: ProductCategory) {
  if (category === 'all') {
    return mockProducts;
  }

  return mockProducts.filter((product) => product.category === category);
}

export function getProductById(productId: string) {
  return mockProducts.find((product) => product.id === productId);
}
