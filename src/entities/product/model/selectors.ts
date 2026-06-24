import { mockProducts } from './mock-products';
import { Product, ProductCategory, ProductSort } from './types';

export const categoryLabels: Record<ProductCategory, string> = {
  album: '앨범',
  all: '전체',
  apparel: '의류',
  goods: '굿즈',
  'light-stick': '응원봉',
  'photo-card': '포토카드',
};

export const sortLabels: Record<ProductSort, string> = {
  'price-high': '높은 가격',
  'price-low': '낮은 가격',
  recommended: '추천순',
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

export function searchProducts({
  category,
  query,
  sort,
}: {
  category: ProductCategory;
  query: string;
  sort: ProductSort;
}) {
  const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR');
  const filteredByCategory = getProductsByCategory(category);
  const filteredByQuery = normalizedQuery
    ? filteredByCategory.filter((product) => isProductMatched(product, normalizedQuery))
    : filteredByCategory;

  return sortProducts(filteredByQuery, sort);
}

function isProductMatched(product: Product, normalizedQuery: string) {
  const searchable = [product.name, product.artist, product.category, ...product.tags]
    .join(' ')
    .toLocaleLowerCase('ko-KR');

  return searchable.includes(normalizedQuery);
}

function sortProducts(products: Product[], sort: ProductSort) {
  const copied = [...products];

  switch (sort) {
    case 'price-high':
      return copied.sort((left, right) => right.price - left.price);
    case 'price-low':
      return copied.sort((left, right) => left.price - right.price);
    case 'recommended':
    default:
      return copied.sort((left, right) => right.reviewCount - left.reviewCount);
  }
}
