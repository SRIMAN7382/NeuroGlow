"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Loader2,
  Star,
  ArrowRight,
  TrendingUp,
  Package,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetcher } from '@/lib/api';

const API_URL = '/api/products';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80';

export default function BrandsPage() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(API_URL, fetcher);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState<Record<string, boolean>>({});

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'products', label: 'Most Products' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Alphabetical' },
  ];

  // Filter and sort brands
  const filteredBrands = data?.brands?.filter(brand => {
    const matchesSearch = !searchQuery || 
      brand.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      Array.from(brand.categories).some(cat => 
        cat.toLowerCase() === selectedCategory.toLowerCase()
      );

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'products':
        return b.productCount - a.productCount;
      case 'rating':
        const aRating = a.products.reduce((sum, p) => sum + (p.rating || 0), 0) / a.products.length;
        const bRating = b.products.reduce((sum, p) => sum + (p.rating || 0), 0) / b.products.length;
        return bRating - aRating;
      case 'name':
        return a.name.localeCompare(b.name);
      default: // 'popular'
        return b.productCount - a.productCount;
    }
  }) || [];

  const categories = data?.categories || [];
  const stats = data ? {
    totalBrands: data.brands.length,
    totalProducts: data.products.length,
    averageRating: data.products.reduce((sum, p) => sum + (p.rating || 0), 0) / data.products.length,
    categories: categories.length
  } : null;

  const handleImageError = (brandSlug: string) => {
    setImageLoadError(prev => ({ ...prev, [brandSlug]: true }));
  };

  const getBrandImage = (brand: any) => {
    if (imageLoadError[brand.slug]) {
      return FALLBACK_IMAGE;
    }
    
    // Find the first valid product image
    const validImage = brand.products.find(p => p.image_link && p.image_link.startsWith('http'))?.image_link;
    return validImage || FALLBACK_IMAGE;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading brands...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error loading brands</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Discover Premium Beauty Brands
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Explore our curated collection of {filteredBrands.length} luxury beauty brands
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search brands..."
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sort by" />
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
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">{stats.totalBrands}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-pink-500" />
                    Total Brands
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">{stats.totalProducts}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    Products Available
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-pink-500" />
                    Average Rating
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">{stats.categories}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-pink-500" />
                    Categories
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={!selectedCategory ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory('')}
            >
              All Categories
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBrands.map((brand) => (
              <div
                key={brand.slug}
                className="relative group"
                onMouseEnter={() => setHoveredBrand(brand.slug)}
                onMouseLeave={() => setHoveredBrand(null)}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardHeader className="relative p-0">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={getBrandImage(brand)}
                        alt={brand.name}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(brand.slug)}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={filteredBrands.indexOf(brand) < 6}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-2">{brand.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            {brand.productCount} Products
                          </Badge>
                          {brand.products.some(p => parseFloat(p.price) > 25) && (
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              Free Shipping
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <span className="font-medium">
                            {(brand.products.reduce((sum, p) => sum + (p.rating || 0), 0) / brand.products.length).toFixed(1)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {Array.from(brand.categories).length} Categories
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {Array.from(brand.productTypes).slice(0, 3).map((type, index) => (
                          <Badge key={index} variant="outline" className="capitalize">
                            {type.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                        onClick={() => router.push(`/brands/${brand.slug}`)}
                      >
                        View Collection
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Hover Preview */}
                {hoveredBrand === brand.slug && brand.products.length > 0 && (
                  <div className="absolute left-full ml-4 top-0 z-50 hidden lg:block">
                    <Card className="w-[300px] shadow-xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Featured Products</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {brand.products.slice(0, 3).map((product) => (
                          <div key={product.id} className="flex gap-3">
                            <div className="relative w-16 h-16 flex-shrink-0">
                              <Image
                                src={product.image_link}
                                alt={product.name}
                                fill
                                className="object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = FALLBACK_IMAGE;
                                }}
                                sizes="64px"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="text-sm font-medium line-clamp-1">
                                {product.name}
                              </h5>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {product.rating || 'No rating'}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-pink-500">
                                {product.price_sign}{parseFloat(product.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                No brands found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}