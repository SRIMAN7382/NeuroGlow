export interface Product {
  id: string;
  brand: string;
  name: string;
  price: string;
  price_sign: string;
  currency: string;
  image_link: string;
  product_link: string;
  website_link: string;
  description: string;
  rating: number | null;
  category: string;
  product_type: string;
  tag_list: string[];
  created_at: string;
  updated_at: string;
  product_api_url: string;
  api_featured_image: string;
  product_colors: ProductColor[];
}

export interface ProductColor {
  hex_value: string;
  colour_name: string;
}

export interface Brand {
  name: string;
  slug: string;
  productCount: number;
  categories: Set<string>;
  productTypes: Set<string>;
  image: string;
  products: Product[];
}

export interface ApiResponse {
  products: Product[];
  brands: Brand[];
  categories: string[];
  productTypes: string[];
  total: number;
  timestamp: string;
  error?: boolean;
  message?: string;
}