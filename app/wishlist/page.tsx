"use client";

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Your wishlist is empty
            </p>
            <Button className="mt-4" asChild>
              <a href="/products">Browse Products</a>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={product.image_link}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black rounded-full"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (product.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({product.rating || 'No rating'})
                    </span>
                  </div>
                  <div className="mb-3">
                    <Badge variant="secondary">
                      {product.brand}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {product.price_sign}{parseFloat(product.price).toFixed(2)}
                    </span>
                    {parseFloat(product.price) > 25 && (
                      <Badge variant="outline" className="text-green-600 dark:text-green-400">
                        Free Shipping
                      </Badge>
                    )}
                  </div>
                  <Button 
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() => {
                      addToCart(product);
                      removeFromWishlist(product.id);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}