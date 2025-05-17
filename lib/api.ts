import { Product, Brand, ApiResponse } from './types';

export async function fetcher(url: string): Promise<ApiResponse> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.message || 'API Error');
  }

  return data;
}

export function getUniqueBrands(products: Product[]): string[] {
  return [...new Set(products.map(p => p.brand))]
    .filter(Boolean)
    .sort();
}

export function getUniqueCategories(products: Product[]): string[] {
  return [...new Set(products.map(p => p.category))]
    .filter(Boolean)
    .sort();
}

export function getUniqueProductTypes(products: Product[]): string[] {
  return [...new Set(products.map(p => p.product_type))]
    .filter(Boolean)
    .sort();
}

export function getUniqueTags(products: Product[]): string[] {
  const tags = new Set<string>();
  products.forEach(product => {
    product.tag_list.forEach(tag => tags.add(tag.toLowerCase()));
  });
  return Array.from(tags).sort();
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  const prices = products
    .map(p => parseFloat(p.price))
    .filter(p => !isNaN(p) && p > 0);
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

export function filterProducts(
  products: Product[],
  filters: {
    brand?: string;
    category?: string;
    product_type?: string;
    searchQuery?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
  } = {}
): Product[] {
  return products.filter(product => {
    // Brand filter
    if (filters.brand && product.brand.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }

    // Category filter
    if (filters.category && product.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }

    // Product type filter
    if (filters.product_type && product.product_type.toLowerCase() !== filters.product_type.toLowerCase()) {
      return false;
    }

    // Search query
    if (filters.searchQuery) {
      const search = filters.searchQuery.toLowerCase();
      const searchMatch = 
        product.name.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search);
      if (!searchMatch) return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const productTags = product.tag_list.map(tag => tag.toLowerCase());
      const hasAllTags = filters.tags.every(tag => 
        productTags.includes(tag.toLowerCase())
      );
      if (!hasAllTags) return false;
    }

    // Price range
    const price = parseFloat(product.price);
    if (!isNaN(price)) {
      if (filters.minPrice && price < filters.minPrice) return false;
      if (filters.maxPrice && price > filters.maxPrice) return false;
    }

    return true;
  });
}

export function groupProductsByBrand(products: Product[]): Record<string, Brand> {
  return products.reduce((acc, product) => {
    const brandName = product.brand;
    const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    if (!acc[brandSlug]) {
      acc[brandSlug] = {
        name: brandName,
        slug: brandSlug,
        productCount: 0,
        categories: new Set(),
        productTypes: new Set(),
        image: product.image_link,
        products: []
      };
    }
    
    acc[brandSlug].productCount++;
    acc[brandSlug].categories.add(product.category);
    acc[brandSlug].productTypes.add(product.product_type);
    acc[brandSlug].products.push(product);
    
    return acc;
  }, {} as Record<string, Brand>);
}

export function getProductStats(products: Product[]) {
  const brands = new Set(products.map(p => p.brand));
  const categories = new Set(products.map(p => p.category));
  const productTypes = new Set(products.map(p => p.product_type));
  const ratings = products
    .map(p => p.rating)
    .filter((r): r is number => r !== null);
  
  const averageRating = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;
  
  return {
    totalProducts: products.length,
    totalBrands: brands.size,
    totalCategories: categories.size,
    totalTypes: productTypes.size,
    averageRating,
    ratedProducts: ratings.length
  };
}