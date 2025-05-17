import { NextResponse } from 'next/server';
import { Product } from '@/lib/types';

const API_URL = 'https://makeup-api.herokuapp.com/api/v1/products.json';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const STALE_CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours (for fallback)
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 30000; // Increased to 30 seconds

// Fallback data for when API is completely unavailable
const FALLBACK_PRODUCTS: Product[] = [
  {
    "id": "495",
    "brand": "maybelline",
    "name": "Maybelline Face Studio Master Hi-Light Light Booster Bronzer",
    "price": "14.99",
    "price_sign": "$",
    "currency": "USD",
    "image_link": "https://d3t32hsnjxo7q6.cloudfront.net/i/991799d3e70b8856686979f8ff6dcfe0_ra,w158,h184_pa,w158,h184.png",
    "product_link": "https://well.ca/products/maybelline-face-studio-master_88837.html",
    "website_link": "https://well.ca",
    "description": "Maybelline Face Studio Master Hi-Light Light Boosting bronzer formula has an expert balance of shade + shimmer illuminator for natural glow. Skin goes soft-lit with zero glitz.",
    "rating": 5,
    "category": "bronzer",
    "product_type": "bronzer",
    "tag_list": ["natural", "luminous"],
    "created_at": "2016-10-01T18:36:15.012Z",
    "updated_at": "2017-12-23T21:08:50.624Z",
    "product_api_url": "https://makeup-api.herokuapp.com/api/v1/products/495.json",
    "api_featured_image": "//s3.amazonaws.com/donovanbailey/products/api_featured_images/000/000/495/original/open-uri20171223-4-9hrto4?1514063330",
    "product_colors": []
  },
  {
    "id": "488",
    "brand": "maybelline",
    "name": "Maybelline Fit Me Bronzer",
    "price": "10.29",
    "price_sign": "$",
    "currency": "USD",
    "image_link": "https://d3t32hsnjxo7q6.cloudfront.net/i/d4f7d82b4858c622bb3c1cef07b9d850_ra,w158,h184_pa,w158,h184.png",
    "product_link": "https://well.ca/products/maybelline-fit-me-bronzer_31265.html",
    "website_link": "https://well.ca",
    "description": "Why You'll Love It\n\nLightweight pigments blend easily and wear evenly\nProvides a natural, fade-proof bronzed color that leaves skin the way it was meant to be...fresh, breathing and natural\n\nFor Best Results: For soft, natural look, brush along cheekbone, sweeping upward.",
    "rating": 4.5,
    "category": "bronzer",
    "product_type": "bronzer",
    "tag_list": ["natural", "fresh"],
    "created_at": "2016-10-01T18:36:05.584Z",
    "updated_at": "2017-12-23T21:08:49.985Z",
    "product_api_url": "https://makeup-api.herokuapp.com/api/v1/products/488.json",
    "api_featured_image": "//s3.amazonaws.com/donovanbailey/products/api_featured_images/000/000/488/original/open-uri20171223-4-deo82c?1514063329",
    "product_colors": [
      {
        "hex_value": "#CF9978",
        "colour_name": "Medium Bronze "
      }
    ]
  },
  {
    "id": "477",
    "brand": "maybelline",
    "name": "Maybelline Color Sensational Vivid Matte Liquid Lip Colour",
    "price": "12.99",
    "price_sign": "$",
    "currency": "USD",
    "image_link": "https://d3t32hsnjxo7q6.cloudfront.net/i/fb9e6485500135d94163577da4a3229a_ra,w158,h184_pa,w158,h184.png",
    "product_link": "https://well.ca/products/maybelline-color-sensational-vivid_120470.html",
    "website_link": "https://well.ca",
    "description": "Bold, vivid color glides easily onto lips for a velvety matte finish with Maybelline Color Sensational Vivid Matte Liquid Lip Colour. \n\nCreamy liquid lip color provides long-lasting moisture.",
    "rating": 3,
    "category": "lipstick",
    "product_type": "lipstick",
    "tag_list": ["vibrant", "matte"],
    "created_at": "2016-10-01T18:35:40.504Z",
    "updated_at": "2017-12-23T21:08:48.745Z",
    "product_api_url": "https://makeup-api.herokuapp.com/api/v1/products/477.json",
    "api_featured_image": "//s3.amazonaws.com/donovanbailey/products/api_featured_images/000/000/477/original/open-uri20171223-4-1m8bc4v?1514063328",
    "product_colors": [
      {
        "hex_value": "#AC7773",
        "colour_name": "Nude Flush"
      },
      {
        "hex_value": "#BD2B2B",
        "colour_name": "Orange Shot"
      },
      {
        "hex_value": "#B73A3A",
        "colour_name": "Rebel Red"
      }
    ]
  },
  {
    "id": "468",
    "brand": "maybelline",
    "name": "Maybelline Color Sensational Rebel Bloom Lipcolour ",
    "price": "9.99",
    "price_sign": "$",
    "currency": "USD",
    "image_link": "https://d3t32hsnjxo7q6.cloudfront.net/i/fb9e6485500135d94163577da4a3229a_ra,w158,h184_pa,w158,h184.png",
    "product_link": "https://well.ca/products/maybelline-color-sensational-rebel_101920.html",
    "website_link": "https://well.ca",
    "description": "Maybelline Color Sensational® Rebel Bloom lipstick offers vivid colors that bloom on your lips. Featuring honey nectar, these lipcolors offer a new kind of floral tinted color.",
    "rating": 5,
    "category": "lipstick",
    "product_type": "lipstick",
    "tag_list": ["floral", "vivid"],
    "created_at": "2016-10-01T18:35:27.706Z",
    "updated_at": "2017-12-23T21:08:47.102Z",
    "product_api_url": "https://makeup-api.herokuapp.com/api/v1/products/468.json",
    "api_featured_image": "//s3.amazonaws.com/donovanbailey/products/api_featured_images/000/000/468/original/open-uri20171223-4-sz64re?1514063327",
    "product_colors": []
  },
  {
    "id": "452",
    "brand": "maybelline",
    "name": "Maybelline Color Sensational Lipcolour",
    "price": "9.99",
    "price_sign": "$",
    "currency": "USD",
    "image_link": "https://d3t32hsnjxo7q6.cloudfront.net/i/b1c627d5a7e341e53754c8dee92d2878_ra,w158,h184_pa,w158,h184.png",
    "product_link": "https://well.ca/products/maybelline-color-sensational_14539.html",
    "website_link": "https://well.ca",
    "description": "Maybelline Colour Sensational Lipcolour will make you fall in love with color all over again! Features:\n\nCrisper color from pure pigments\nCreamier feel from nourishing honey nectar\nLipcolor so rich, so stunning… it's sensational\nAvailable in many sensational shades",
    "rating": 4,
    "category": "lipstick",
    "product_type": "lipstick",
    "tag_list": ["pure", "rich"],
    "created_at": "2016-10-01T18:35:07.476Z",
    "updated_at": "2017-12-23T20:51:17.460Z",
    "product_api_url": "https://makeup-api.herokuapp.com/api/v1/products/452.json",
    "api_featured_image": "//s3.amazonaws.com/donovanbailey/products/api_featured_images/000/000/452/original/open-uri20171223-4-1pmofky?1514062277",
    "product_colors": [
      {
        "hex_value": "#E70C2F",
        "colour_name": "Are you red-dy "
      },
      {
        "hex_value": "#DF8A82",
        "colour_name": "Born With It "
      },
      {
        "hex_value": "#F15B50",
        "colour_name": "Coral Crush "
      }
    ]
  }
];

// Circuit breaker configuration
const CIRCUIT_BREAKER = {
  failures: 0,
  lastFailure: 0,
  threshold: 5, // Number of failures before opening circuit
  resetTimeout: 1000 * 60 * 5, // 5 minutes
};

let productsCache: {
  data: Product[] | null;
  timestamp: number;
  isStale?: boolean;
} = {
  data: null,
  timestamp: 0
};

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isCircuitOpen(): boolean {
  if (CIRCUIT_BREAKER.failures >= CIRCUIT_BREAKER.threshold) {
    const timeSinceLastFailure = Date.now() - CIRCUIT_BREAKER.lastFailure;
    if (timeSinceLastFailure < CIRCUIT_BREAKER.resetTimeout) {
      return true;
    }
    // Reset circuit after timeout
    CIRCUIT_BREAKER.failures = 0;
  }
  return false;
}

function recordFailure() {
  CIRCUIT_BREAKER.failures++;
  CIRCUIT_BREAKER.lastFailure = Date.now();
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY): Promise<Response> {
  if (isCircuitOpen()) {
    throw new Error('Circuit breaker is open - too many recent failures');
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Makeup-API-Client/1.0;)'
      }
      // Removed next: { revalidate: 3600 } to prevent caching error
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Reset circuit breaker on successful request
    CIRCUIT_BREAKER.failures = 0;
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error(`Request timed out after ${REQUEST_TIMEOUT}ms`);
      throw new Error(`Request timed out after ${REQUEST_TIMEOUT}ms`);
    }

    // Check for specific network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      recordFailure();
      throw new Error(`API endpoint unreachable: ${error.code}`);
    }

    if (retries === 0) {
      recordFailure();
      throw new Error(`Failed to fetch after ${MAX_RETRIES} retries: ${error}`);
    }

    console.log(`Retry attempt ${MAX_RETRIES - retries + 1} after ${delay}ms`);
    await wait(delay);
    return fetchWithRetry(url, retries - 1, delay * 2);
  }
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const now = Date.now();
    
    // Return fresh cache if available
    if (productsCache.data && (now - productsCache.timestamp) < CACHE_DURATION) {
      return productsCache.data;
    }

    // Try to fetch fresh data
    const response = await fetchWithRetry(API_URL);
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid data format received from API');
    }

    const normalizedProducts = data
      .filter(item => 
        item && 
        typeof item === 'object' && 
        item.brand && 
        item.name && 
        item.image_link
      )
      .map(item => ({
        id: String(item.id),
        brand: item.brand,
        name: item.name,
        price: item.price || '0.00',
        price_sign: item.price_sign || '$',
        currency: item.currency || 'USD',
        image_link: item.image_link,
        product_link: item.product_link || '',
        website_link: item.website_link || '',
        description: item.description || 'No description available',
        rating: item.rating ? Number(item.rating) : null,
        category: item.category || 'Uncategorized',
        product_type: item.product_type || 'other',
        tag_list: Array.isArray(item.tag_list) ? item.tag_list : [],
        created_at: item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || new Date().toISOString(),
        product_api_url: item.product_api_url || '',
        api_featured_image: item.api_featured_image || '',
        product_colors: Array.isArray(item.product_colors) ? item.product_colors : []
      }));

    // Update cache with fresh data
    productsCache = {
      data: normalizedProducts,
      timestamp: now,
      isStale: false
    };

    return normalizedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);

    // Return stale cache if available (within extended duration)
    if (productsCache.data && (Date.now() - productsCache.timestamp) < STALE_CACHE_DURATION) {
      console.log('Returning stale cache data');
      productsCache.isStale = true;
      return productsCache.data;
    }

    // If no cache available, return fallback data
    console.log('Returning fallback data');
    return FALLBACK_PRODUCTS;
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const brand = url.searchParams.get('brand')?.toLowerCase();
    const category = url.searchParams.get('category')?.toLowerCase();
    const product_type = url.searchParams.get('product_type')?.toLowerCase();

    let products = await fetchProducts();

    if (brand || category || product_type) {
      products = products.filter(product => {
        const matchesBrand = !brand || product.brand.toLowerCase() === brand;
        const matchesCategory = !category || product.category.toLowerCase() === category;
        const matchesType = !product_type || product.product_type.toLowerCase() === product_type;
        return matchesBrand && matchesCategory && matchesType;
      });
    }

    const brands = products.reduce((acc, product) => {
      const brandName = product.brand;
      if (!acc[brandName]) {
        acc[brandName] = {
          name: brandName,
          slug: brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          productCount: 0,
          categories: new Set(),
          productTypes: new Set(),
          image: product.image_link,
          products: []
        };
      }
      acc[brandName].productCount++;
      acc[brandName].categories.add(product.category);
      acc[brandName].productTypes.add(product.product_type);
      acc[brandName].products.push(product);
      return acc;
    }, {} as Record<string, any>);

    const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
    const productTypes = [...new Set(products.map(p => p.product_type))].filter(Boolean);

    return NextResponse.json({
      products,
      brands: Object.values(brands),
      categories,
      productTypes,
      total: products.length,
      timestamp: new Date().toISOString(),
      isStale: productsCache.isStale || false
    });
  } catch (error: any) {
    console.error('API Error:', error);
    
    return NextResponse.json({
      error: true,
      message: error.message || 'Failed to fetch products',
      timestamp: new Date().toISOString()
    }, { 
      status: 500 
    });
  }
}