"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Sparkles } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "AI Skin Analysis",
      description:
        "Unlock intelligent, personalized recommendations powered by real-time AI skin diagnostics.",
      image:
        "https://images.unsplash.com/photo-1621798458947-701c68c6d374?auto=format&fit=crop&q=80&w=1080",
    },
    {
      icon: Star,
      title: "Premium Brands",
      description:
        "Only the most reputable and high-efficacy skincare brands curated just for your needs.",
      image:
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1080",
    },
    {
      icon: Shield,
      title: "Expert Guidance",
      description:
        "AI meets dermatology—get science-backed routines designed by experts in seconds.",
      image:
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=1080",
    },
  ];

  return (
    <main className="min-h-screen w-full overflow-x-hidden font-sans">
      {/* Hero */}
      <section className="relative flex items-center justify-center h-[100dvh] text-white">
        <Image
          src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1920"
          alt="Beautiful woman glowing skin"
          fill
          className="absolute inset-0 z-0 object-cover"
          priority
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 to-pink-800/30" />

        <div className="relative z-10 text-left max-w-3xl px-6">
          <h1 className="text-6xl md:text-8xl font-extrabold leading-tight">
            NeuroGlow
            <span className="block text-pink-400">AI meets Beauty</span>
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-gray-200">
            A new era of intelligent skincare powered by the future of beauty tech.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/analysis">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
                Start AI Analysis <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/skincare">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 bg-white dark:bg-gray-900 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Why NeuroGlow?
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Designed to deliver futuristic skincare through intelligent analysis and curated solutions.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 px-6 md:px-0">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group rounded-3xl overflow-hidden shadow-2xl transition-transform transform hover:scale-[1.02]"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <div className="p-6 text-left bg-white dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <feature.icon className="h-6 w-6 text-pink-500" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-28 bg-gray-100 dark:bg-gray-800 text-center">
        <Image
          src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=1920"
          alt="Skincare products"
          fill
          className="absolute inset-0 opacity-10 object-cover"
        />
        <div className="relative z-10 px-6 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Thousands trust NeuroGlow for intelligent skin solutions. Be one of them.
          </p>
          <Link href="/analysis">
            <Button size="lg" className="bg-pink-600 hover:bg-pink-700 text-white">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}