"use client";

import { useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Search, Loader2, Heart, ShoppingCart } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://makeup-api.herokuapp.com/api/v1/products.json';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  });

export default function ProductsPage() {
  const { data, error, isLoading } = useSWR(API_URL, fetcher);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const { toast } = useToast();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} removed from wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} added to wishlist.`,
      });
    }
  };

  const filteredProducts = data?.filter((product: any) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center text-red-500">
        Failed to load products: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="relative w-full max-w-md">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: any) => (
            <Card key={product.id} className="group h-full">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={product.image_link || 'https://via.placeholder.com/400x400'}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                      unoptimized
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 dark:bg-black/80 rounded-full"
                    onClick={() => handleWishlist(product)}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isInWishlist(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    />
                  </Button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-2 mb-2 hover:text-pink-500">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (product.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({product.rating || 'No rating'})
                    </span>
                  </div>

                  <div className="mb-2">
                    <Badge variant="secondary">{product.brand || 'Unknown Brand'}</Badge>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {product.price_sign || '$'}
                      {parseFloat(product.price || '0').toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleWishlist(product)}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                isInWishlist(product.id)
                                  ? 'fill-red-500 text-red-500'
                                  : ''
                              }`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add to Wishlist</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-600 dark:text-gray-300">
            No products found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
