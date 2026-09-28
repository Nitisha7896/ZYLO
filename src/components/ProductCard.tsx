import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
  onQuickAdd: (product: Product, selectedColor: string, selectedSize: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  currency: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenQuickView,
  onQuickAdd,
  isWishlisted,
  onToggleWishlist,
  currency,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [isHovered, setIsHovered] = useState(false);
  const [quickAddSuccess, setQuickAddSuccess] = useState(false);

  // Format price
  const formatPrice = (amount: number) => {
    switch (currency) {
      case 'EUR':
        return `€${Math.round(amount * 0.92)}`;
      case 'GBP':
        return `£${Math.round(amount * 0.78)}`;
      default:
        return `$${amount}`;
    }
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'One Size';
    onQuickAdd(product, selectedColor, defaultSize);
    setQuickAddSuccess(true);
    setTimeout(() => setQuickAddSuccess(false), 1600);
  };

  const currentImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <article
      className="group flex flex-col bg-transparent transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage (65-75% height) */}
      <div className="relative aspect-[3/4] w-full bg-[#F3F2EC] overflow-hidden">
        {/* Subtle Tag if Present (Never pill badges - quiet text kicker) */}
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 text-[10px] tracking-[0.16em] uppercase font-semibold text-stone-800 bg-white/90 backdrop-blur-xs px-2.5 py-1">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-stone-700 hover:text-black hover:scale-105 transition-all shadow-xs"
        >
          <Heart
            size={16}
            className={isWishlisted ? 'fill-[#141414] text-[#141414]' : 'stroke-current'}
          />
        </button>

        {/* Product Imagery with Secondary Hover Swap */}
        <div
          onClick={() => onOpenQuickView(product)}
          className="w-full h-full cursor-pointer relative"
        >
          <img
            src={currentImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              // Graceful fallback container
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Quick View Button Hover Layer */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenQuickView(product);
              }}
              className="flex-1 py-2.5 bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-medium tracking-wider uppercase flex items-center justify-center gap-1.5 hover:bg-white shadow-xs transition-colors"
            >
              <Eye size={13} />
              <span>Quick View</span>
            </button>

            <button
              onClick={handleQuickAddClick}
              aria-label="Quick add to bag"
              className="px-3.5 py-2.5 bg-[#141414] text-white hover:bg-black transition-colors flex items-center justify-center shadow-xs"
              title="Add default size to bag"
            >
              {quickAddSuccess ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <ShoppingBag size={14} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="pt-3.5 pb-2 flex flex-col flex-1">
        {/* Unboxed Metadata with Typographic Separator */}
        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 uppercase tracking-wider mb-1">
          <span>{product.subcategory}</span>
          <span aria-hidden="true">·</span>
          <span>{product.colors.length} {product.colors.length === 1 ? 'Tone' : 'Tones'}</span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onOpenQuickView(product)}
          className="font-medium text-[15px] text-stone-900 tracking-tight leading-snug cursor-pointer hover:underline underline-offset-4 line-clamp-1"
        >
          {product.name}
        </h3>

        {/* Rating summary */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex items-center text-stone-800">
            <Star size={11} className="fill-stone-900 text-stone-900" />
          </div>
          <span className="text-[11px] font-mono text-stone-700">{product.rating.toFixed(1)}</span>
          <span className="text-[11px] text-stone-400 font-mono">({product.reviewCount})</span>
        </div>

        {/* Color Swatch Dots */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {product.colors.map((color) => {
            const isCurrent = selectedColor === color.name;
            return (
              <button
                key={color.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColor(color.name);
                }}
                title={color.name}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  isCurrent ? 'ring-1 ring-stone-900 ring-offset-1 border-stone-800' : 'border-stone-300'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>

        {/* Price Row (Tabular Figures) */}
        <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <span className="text-[11px] text-stone-500 font-light truncate max-w-[120px]">
            {product.sizes.length > 1 ? `${product.sizes.length} Sizes` : product.sizes[0]}
          </span>
        </div>
      </div>
    </article>
  );
};
