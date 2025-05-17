"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Camera, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SkinCondition {
  name: string;
  probability: number;
  description: string;
}

interface Recommendation {
  name: string;
  image: string;
  description: string;
  price: string;
  benefits: string[];
  profit_link: string;
}

interface AnalysisResult {
  prediction: string;
  probabilities: Record<string, number>;
  recommendations: Recommendation[];
  conditions: SkinCondition[];
}

export default function AnalysisPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setResult(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setImage(URL.createObjectURL(file));
    processImage(file);
  };

  const processImage = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://neuro-glow-api.onrender.com/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError("Failed to analyze image. Please try again.");
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              Get personalized skincare recommendations based on advanced AI analysis of your skin.
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
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button onClick={handleClickUpload} className="flex items-center gap-2">
                <Upload className="w-5 h-5" /> Upload Photo
              </Button>
              <Button onClick={handleClickUpload} variant="outline" className="flex items-center gap-2">
                <Camera className="w-5 h-5" /> Take Photo
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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
              <>
                <Card className="w-full max-w-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Analysis Results
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Primary Condition</p>
                        <p className="text-lg font-medium text-gray-900 dark:text-white capitalize">
                          {result.prediction.replace(/_/g, ' ')}
                        </p>
                      </div>
                      {Object.entries(result.probabilities).map(([condition, probability]) => (
                        <div key={condition} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {condition.replace(/_/g, ' ')}
                            </p>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {Math.round(probability * 100)}%
                            </span>
                          </div>
                          <Progress value={probability * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {result.recommendations.length > 0 && (
                  <div className="w-full mt-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Recommended Products
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.recommendations.map((product, idx) => (
                        <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-40">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain p-4 bg-white"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                              {product.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {product.benefits.map((benefit, i) => (
                                <Badge key={i} variant="secondary">
                                  {benefit.trim()}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900 dark:text-white">
                                ${parseFloat(product.price).toFixed(2)}
                              </span>
                              <Button
                                asChild
                                className="bg-pink-500 hover:bg-pink-600"
                              >
                                <a
                                  href={product.profit_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Buy Now
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}