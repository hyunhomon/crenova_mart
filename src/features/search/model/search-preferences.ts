import { ProductCategory } from '@/entities/product';
import { getPreference, setPreference } from '@/shared/lib/storage';

const SEARCH_PREFERENCES_KEY = 'fandom-and:search-preferences';
const RECENT_SEARCH_LIMIT = 10;

export type SearchPreferences = {
  filters: {
    category: ProductCategory;
    maxPrice?: number;
    minPrice?: number;
  };
  recentSearches: string[];
};

export const defaultRecentSearches = ['응원봉', '포토카드', '후드'];

const defaultSearchPreferences: SearchPreferences = {
  filters: {
    category: 'all',
  },
  recentSearches: defaultRecentSearches,
};

export async function loadSearchPreferences() {
  const preferences = await getPreference<Partial<SearchPreferences>>(
    SEARCH_PREFERENCES_KEY,
    defaultSearchPreferences
  );

  return normalizeSearchPreferences(preferences);
}

export async function saveSearchFilters(filters: SearchPreferences['filters']) {
  const preferences = await loadSearchPreferences();

  await saveSearchPreferences({
    ...preferences,
    filters,
  });
}

export async function addRecentSearch(query: string) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return loadSearchPreferences();
  }

  const preferences = await loadSearchPreferences();
  const recentSearches = [
    normalizedQuery,
    ...preferences.recentSearches.filter((item) => item !== normalizedQuery),
  ].slice(0, RECENT_SEARCH_LIMIT);
  const nextPreferences = {
    ...preferences,
    recentSearches,
  };

  await saveSearchPreferences(nextPreferences);

  return nextPreferences;
}

function saveSearchPreferences(preferences: SearchPreferences) {
  return setPreference(SEARCH_PREFERENCES_KEY, preferences);
}

function normalizeSearchPreferences(preferences: Partial<SearchPreferences>): SearchPreferences {
  return {
    filters: {
      category: preferences.filters?.category ?? defaultSearchPreferences.filters.category,
      maxPrice: preferences.filters?.maxPrice,
      minPrice: preferences.filters?.minPrice,
    },
    recentSearches:
      preferences.recentSearches && preferences.recentSearches.length > 0
        ? preferences.recentSearches
        : defaultRecentSearches,
  };
}
