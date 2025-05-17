"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Award, Users, Globe, Sparkles, Star } from 'lucide-react';

const heroImage = 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80';
const missionImage = 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80';

const founder = {
  name: 'Dr. Sagili Sridhar Reddy',
  role: 'Founder & Lead Dentist',
  bio: 'Dr. Sagili Sridhar Reddy is the founder of Jacksonville Cosmetic Dentistry, renowned for his artistry in smile makeovers and attention to detail. With a passion for enhancing natural beauty through advanced dental techniques, Dr. Reddy brings years of experience in cosmetic and restorative dentistry.',
  expertise: ['Smile Makeovers', 'Cosmetic Dentistry', 'Restorative Dental Care'],
  image: 'https://www.jaxcosmeticdentist.com/wp-content/uploads/2023/03/Dr.Sagili.jpg'
};

const achievements = [
  { icon: Users, title: '50K+ Users', description: 'Trusted by customers worldwide' },
  { icon: Award, title: 'AI-Powered Analysis', description: 'Advanced skin analysis technology' },
  { icon: Globe, title: 'Global Products', description: 'Curated international brands' },
  { icon: Star, title: '4.8 Star Rating', description: 'Based on customer reviews' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image src={heroImage} alt="Hero background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-6">AI-Powered Beauty Solutions</h1>
            <p className="text-xl text-gray-200 mb-8">Experience personalized skincare recommendations powered by advanced artificial intelligence, helping you discover products that perfectly match your unique needs.</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white">Try AI Analysis</Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">Explore Products</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Our Innovation</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Advanced AI Technology for Perfect Product Matching</h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300">
                <p>Our cutting-edge AI technology analyzes your unique skin characteristics and preferences to recommend the perfect beauty products for your needs.</p>
                <p>By combining machine learning with expert beauty knowledge, we deliver personalized recommendations that evolve with your skincare journey.</p>
              </div>
            </div>
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image src={missionImage} alt="AI Beauty Analysis" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Transforming beauty routines through technology and personalization.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/20 text-pink-500 mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Founder</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Dr. Sagili Sridhar Reddy leads with passion, skill, and an unwavering commitment to patient care and excellence.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-[4/3]">
                <Image 
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{founder.name}</h3>
                <p className="text-pink-500 dark:text-pink-400 mb-4">{founder.role}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{founder.bio}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {founder.expertise.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}