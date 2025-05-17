"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, Loader2, Star, ShoppingCart } from "lucide-react";
import { PRODUCT_DB } from "@/lib/constants/products";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function AnalysisPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    skinType: string;
    acneLevel: string;
    wrinkles: string;
    spots: string;
    darkCircles: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useStore();
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      processImage(file);
    }
  };

  const processImage = async (file: File) => {
    setLoading(true);
    
    try {
      // Simulated API response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult({
        skinType: "Combination",
        acneLevel: "Mild",
        wrinkles: "Minimal",
        spots: "Moderate",
        darkCircles: "Mild"
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = () => {
    if (!result) return [];

    const recommendedProducts = new Set();

    // Add from skin type
    if (result.skinType.toLowerCase() === "oily") {
      recommendedProducts.add("Oil-Free Moisturizer");
    }

    if (result.acneLevel !== "None") {
      PRODUCT_DB.acne.treatments.forEach((p) => recommendedProducts.add(JSON.stringify(p)));
    }
    if (result.wrinkles !== "None") {
      PRODUCT_DB.wrinkles.treatments.forEach((p) => recommendedProducts.add(JSON.stringify(p)));
    }
    if (result.spots !== "None") {
      PRODUCT_DB["dark spots"].treatments.forEach((p) => recommendedProducts.add(JSON.stringify(p)));
    }
    if (result.darkCircles !== "None") {
      PRODUCT_DB["dark circles"].treatments.forEach((p) => recommendedProducts.add(JSON.stringify(p)));
    }

    return Array.from(recommendedProducts).map((p) => {
      try {
        return JSON.parse(p);
      } catch {
        return { name: p };
      }
    });
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.name,
      name: product.name,
      brand: "Recommended",
      price: product.price.toString(),
      price_sign: "$",
      currency: "USD",
      image_link: product.image,
      description: product.description,
      rating: 5,
      category: "Skincare",
      product_type: "treatment",
      tag_list: product.benefits || []
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80"
            alt="AI Skin Analysis"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              AI Skin Analysis
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Get a personalized skincare routine based on your unique skin profile using our advanced AI technology.
            </p>
          </div>
        </div>
      </section>

      {/* Analysis Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Upload Your Photo
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Take or upload a clear photo of your face in natural lighting for the most accurate analysis.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-4">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="image-upload"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button className="flex items-center gap-2">
                  <Upload className="w-5 h-5" /> Upload Photo
                </Button>
              </label>
              <Button variant="outline" className="flex items-center gap-2">
                <Camera className="w-5 h-5" /> Take Photo
              </Button>
            </div>

            {image && (
              <Card className="w-full max-w-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-80 w-full">
                    <Image
                      src={image}
                      alt="Uploaded"
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing your skin...
              </div>
            )}

            {result && (
              <Card className="w-full max-w-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Analysis Results
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Skin Type</p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">{result.skinType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Acne Level</p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">{result.acneLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Wrinkles</p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">{result.wrinkles}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Dark Spots</p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">{result.spots}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Dark Circles</p>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">{result.darkCircles}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="w-full max-w-4xl mt-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Recommended Products
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getRecommendations().map((product, index) => (
                    <Card key={index} className="overflow-hidden">
                      {product.image && (
                        <div className="relative h-40">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-4 bg-white"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.benefits?.map((benefit: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ${product.price}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="bg-pink-500 hover:bg-pink-600"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}