"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import AuthButton from '@/components/auth-button';
import CartButton from '@/components/cart-button';
import {
  Search,
  Heart,
  Menu,
  X,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;
  const isHomePage = pathname === '/';

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled || !isHomePage
          ? 'bg-white/95 backdrop-blur-lg shadow-lg dark:bg-gray-900/95'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
            >
              <Sparkles className="h-8 w-8 text-pink-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-500 group-hover:to-pink-500">
                NeuroGlow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { path: '/products', label: 'Products' },
              { path: '/brands', label: 'Brands' },
              { path: '/analysis', label: 'AI Analysis' },
              { path: '/about', label: 'About' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                className={`relative group ${
                  isScrolled || !isHomePage
                    ? 'text-gray-800 dark:text-gray-200'
                    : isHomePage
                    ? 'text-white'
                    : 'text-gray-800 dark:text-gray-200'
                } transition-colors duration-200 hover:text-pink-500 dark:hover:text-pink-400`}
              >
                <span className={`relative z-10 ${isActive(path) ? 'font-semibold' : ''}`}>
                  {label}
                </span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    isActive(path) ? 'scale-x-100' : ''
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`${
                isScrolled || !isHomePage
                  ? 'text-gray-800 hover:text-pink-500 dark:text-gray-200 dark:hover:text-pink-400'
                  : isHomePage
                  ? 'text-white hover:text-pink-300'
                  : 'text-gray-800 hover:text-pink-500 dark:text-gray-200 dark:hover:text-pink-400'
              } transition-colors duration-200`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
              ) : (
                <Moon className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`${
                isScrolled || !isHomePage
                  ? 'text-gray-800 hover:text-pink-500 dark:text-gray-200 dark:hover:text-pink-400'
                  : isHomePage
                  ? 'text-white hover:text-pink-300'
                  : 'text-gray-800 hover:text-pink-500 dark:text-gray-200 dark:hover:text-pink-400'
              } transition-all duration-200 hover:scale-110`}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className={`${
                  isScrolled || !isHomePage
                    ? 'text-gray-800 hover:text-pink-500 dark:text-gray-200 dark:hover:text-pink-400'
                    : isHomePage
                    ? 'text-white hover:text-pink-300'
                    : 'text-gray-800 hover:text-pink-500 dark:text-gray-200 dark:hover:text-pink-400'
                } transition-all duration-200 hover:scale-110`}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <CartButton />
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${
                isScrolled || !isHomePage
                  ? 'text-gray-800 hover:text-pink-500 dark:text-gray-200 dark:hover:text-pink-400'
                  : isHomePage
                  ? 'text-white hover:text-pink-300'
                  : 'text-gray-800 hover:text-pink-500 dark:text-gray-200 dark:hover:text-pink-400'
              } transition-colors duration-200`}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white dark:bg-gray-900 shadow-lg px-4 pt-2 pb-3 space-y-1">
          {[
            { path: '/products', label: 'Products' },
            { path: '/brands', label: 'Brands' },
            { path: '/analysis', label: 'AI Analysis' },
            { path: '/about', label: 'About' },
          ].map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                isActive(path)
                  ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/20'
                  : 'text-gray-800 hover:text-pink-500 hover:bg-pink-50 dark:text-gray-200 dark:hover:text-pink-400 dark:hover:bg-pink-900/20'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="flex items-center justify-between px-3 py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-gray-800 hover:text-pink-500 dark:text-gray-200 dark:hover:text-pink-400"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-800 hover:text-pink-500 dark:text-gray-200 dark:hover:text-pink-400"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-800 hover:text-pink-500 dark:text-gray-200 dark:hover:text-pink-400"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <CartButton />
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}