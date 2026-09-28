import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToBag: (product: Product) => void;
  currency: string;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onMoveToBag,
  currency,
}) => {
  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#FAF9F6] h-full shadow-2xl flex flex-col z-10 border-l border-[#E8E6DF] animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E6DF]">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-stone-900 fill-stone-900" />
            <h2 className="font-serif text-2xl font-normal text-stone-900">Saved Creations</h2>
            <span className="font-mono text-xs text-stone-500">({wishlistProducts.length})</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close wishlist"
            className="p-1.5 text-stone-400 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-stone-200/70">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-stone-400">
                <Heart size={24} />
              </div>
              <h3 className="font-serif text-2xl text-stone-800">Your curation is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                Save your favorite tailored silhouettes, handbags, and accessories to revisit later.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-wider font-medium"
              >
                Browse Creations
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div key={product.id} className="pt-4 first:pt-0 flex gap-4">
                <div className="w-20 h-26 bg-stone-200 shrink-0 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-xs sm:text-sm text-stone-900 leading-snug">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        aria-label="Remove item"
                        className="text-stone-400 hover:text-stone-800 transition-colors p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                      {product.subcategory} · {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onMoveToBag(product)}
                      className="w-full py-2 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag size={13} />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
