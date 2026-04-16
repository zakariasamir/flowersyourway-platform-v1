"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import { 
  LuShoppingBag as ShoppingBag, 
  LuStar as Star, 
  LuPlus as Plus, 
  LuHeart as Heart 
} from "react-icons/lu";
import { useTranslation } from "@/lib/language-context";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    categoryId?: {
      name: string;
      slug: string;
    };
    images: string[];
    stock: number;
    rating: number;
    reviewCount: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { t } = useTranslation();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;

    await addItem({
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || "",
    });

    toast.success(`${product.name} ${t('product.addedToCart')}`);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white dark:bg-zinc-950">
      {/* Image Section */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        <Link href={`/customer/products/${product._id}`} className="z-0">
          <Image
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Floating Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-md shadow-sm"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-destructive text-destructive" : ""}`} />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              {discountPercentage}% {t('common.off')}
            </div>
          )}
          {product.stock <= 0 && (
            <div className="bg-zinc-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-sm">
              {t('product.outOfStock')}
            </div>
          )}
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 bg-gradient-to-t from-black/60 to-transparent">
          <Button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-white text-black hover:bg-primary hover:text-white border-none h-10 gap-2 font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('product.addToCart')}
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {product.categoryId?.name || "Premium Collection"}
          </p>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-bold">{product.rating || 5.0}</span>
          </div>
        </div>

        <Link href={`/customer/products/${product._id}`} className="hover:text-primary transition-colors">
          <h3 className="font-serif text-lg font-semibold leading-tight line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-muted-foreground line-through decoration-destructive/50">
                {product.originalPrice?.toFixed(2)} MAD
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              {product.price.toFixed(2)} <span className="text-[10px] font-medium">MAD</span>
            </span>
          </div>
          
          <Link 
            href={`/customer/products/${product._id}`}
            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            {t('product.details')} →
          </Link>
        </div>
      </div>
    </Card>
  );
}