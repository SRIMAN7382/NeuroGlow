"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const API_URL = 'https://makeup-api.herokuapp.com/api/v1/products.json';

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  });

export default function ProductPage() {
  const params = useParams();
  const { data, error, isLoading } = useSWR(API_URL, fetcher);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error loading product</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const product = data?.find((p: any) => p.id.toString() === params.id);

  if (!product) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
          <Link href="/products">
            <Button className="bg-pink-500 hover:bg-pink-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/products">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={product.image_link || 'https://via.placeholder.com/400x400'}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                  unoptimized
                />
              </div>
            </Card>

            {product.product_colors && product.product_colors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.product_colors.map((color: any, index: number) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedImage === index ? 'border-pink-500' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.hex_value }}
                    onClick={() => setSelectedImage(index)}
                    title={color.colour_name}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-6">
              <Badge variant="secondary" className="mb-2">
                {product.brand || 'Unknown Brand'}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
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
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {product.price_sign || '$'}
                {parseFloat(product.price || '0').toFixed(2)}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.tag_list.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWishlist}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist(product.id)
                      ? 'fill-red-500 text-red-500'
                      : ''
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}