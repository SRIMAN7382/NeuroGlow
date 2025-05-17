'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Product, ProductFilters } from '@/lib/types';
import { 
  fetcher, 
  filterProducts, 
  getUniqueBrands, 
  getUniqueProductTypes,
  getUniqueTags,
  getPriceRange,
  getProductStats 
} from '@/lib/api';
import { Search, Star, AlertCircle, Filter } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const API_URL = '/api/products';

export default function SkincarePage() {
  const { data, error, isLoading } = useSWR<Product[]>(API_URL, fetcher);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Ensure data is an array before processing
  const products = Array.isArray(data) ? data : [];

  // Derived state
  const brands = products ? getUniqueBrands(products) : [];
  const productTypes = products ? getUniqueProductTypes(products) : [];
  const tags = products ? getUniqueTags(products) : [];
  const priceRange = products ? getPriceRange(products) : { min: 0, max: 100 };
  const stats = products ? getProductStats(products) : null;

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(filterProducts(products, { ...filters, searchQuery, tags: selectedTags }));
    }
  }, [products, filters, searchQuery, selectedTags]);

  const sortOptions = [
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Best Rated' },
    { value: 'name', label: 'Name' },
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load products. Please try again later.
            {error.message && <div className="mt-2 text-sm">{error.message}</div>}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Beauty Products
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {filteredProducts.length} products found
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Total Products</CardTitle>
                <CardDescription className="text-2xl font-bold text-pink-500">
                  {stats.totalProducts}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Brands</CardTitle>
                <CardDescription className="text-2xl font-bold text-pink-500">
                  {stats.totalBrands}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Categories</CardTitle>
                <CardDescription className="text-2xl font-bold text-pink-500">
                  {stats.totalTypes}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">Avg Rating</CardTitle>
                <CardDescription className="text-2xl font-bold text-pink-500">
                  {stats.averageRating.toFixed(1)}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Select
              value={filters.brand}
              onValueChange={(value) => setFilters({ ...filters, brand: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand.toLowerCase()}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.product_type}
              onValueChange={(value) => setFilters({ ...filters, product_type: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters({ ...filters, sortBy: value as ProductFilters['sortBy'] })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Popular Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 15).map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                <Image
                  src={product.image_link}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571';
                  }}
                  unoptimized
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {product.brand} · {product.product_type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </CardDescription>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {product.price_sign}{parseFloat(product.price).toFixed(2)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {product.rating || 'No rating'} 
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tag_list.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}