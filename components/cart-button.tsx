"use client";

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useStore } from '@/lib/store';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity } = useStore();
  const { toast } = useToast();

  const total = cart.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "This is a demo site. No actual checkout process is implemented.",
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {cart.length === 0 ? 'Your cart is empty' : `${cart.length} items in your cart`}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 mb-4 pb-4 border-b">
              <div className="relative w-20 h-20">
                <Image
                  src={item.image_link}
                  alt={item.name}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/200x200?text=Product';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.brand}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {cart.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}