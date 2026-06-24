import { mockProducts } from './mock-products';
import { Product, ProductCategory, ProductSort } from './types';

export const categoryLabels: Record<ProductCategory, string> = {
  all: '전체',
  baby: '출산/유아동',
  beauty: '뷰티',
  'books-music': '도서/음반/DVD',
  'daily-goods': '생활용품',
  electronics: '가전디지털',
  food: '식품',
  'fresh-food': '신선식품',
  health: '헬스/건강식품',
  'home-interior': '홈인테리어',
  kitchen: '주방용품',
  'men-fashion': '남성패션',
  office: '문구/오피스',
  pets: '반려동물용품',
  sports: '스포츠/레저',
  'toys-hobbies': '완구/취미',
  'women-fashion': '여성패션',
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

export function getRelatedProducts(productId: string, limit = 6) {
  const currentProduct = getProductById(productId);

  if (!currentProduct) {
    return mockProducts.slice(0, limit);
  }

  return mockProducts
    .filter((product) => product.id !== productId)
    .map((product) => {
      const sharedTagCount = product.tags.filter((tag) => currentProduct.tags.includes(tag)).length;
      const score =
        (product.category === currentProduct.category ? 4 : 0) +
        (product.artist === currentProduct.artist ? 2 : 0) +
        sharedTagCount;

      return { product, score };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return right.product.reviewCount - left.product.reviewCount;
    })
    .map(({ product }) => product)
    .slice(0, limit);
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
