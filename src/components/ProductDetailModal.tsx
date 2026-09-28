import React, { useState } from 'react';
import {
  X,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Ruler,
  ShoppingBag,
} from 'lucide-react';
import { Product, Review } from '../types';
import { ReviewsSection } from './ReviewsSection';
import { WriteReviewModal } from './WriteReviewModal';
import { SizeGuideModal } from './SizeGuideModal';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor: string, selectedSize: string, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  currency: string;
  onVoteHelpful: (productId: string, reviewId: string) => void;
  onAddReview: (productId: string, review: Review) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  currency,
  onVoteHelpful,
  onAddReview,
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'One Size');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>('description');
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

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

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, selectedSize, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 lg:p-6">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal Window */}
        <div className="relative bg-[#FAF9F6] w-full max-w-5xl max-h-[92vh] shadow-2xl z-10 border border-[#E8E6DF] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close product view"
            className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 backdrop-blur-xs rounded-full flex items-center justify-center text-stone-500 hover:text-black hover:scale-105 transition-all shadow-xs"
          >
            <X size={18} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column: Visual Gallery (7 cols) */}
            <div className="lg:col-span-7 bg-[#F4F2EC] p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E8E6DF]">
              {/* Main Active Image Viewport */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-200 shadow-xs">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={`${product.name} view ${activeImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 text-[10px] tracking-[0.16em] uppercase font-semibold text-stone-900 bg-white/95 px-3 py-1 shadow-xs">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-20 shrink-0 border-2 overflow-hidden transition-all ${
                        activeImageIndex === idx
                          ? 'border-stone-900 ring-1 ring-stone-900'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Contiguous Purchase Module & Information (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Category & Origin Line */}
                <div className="flex items-center gap-2 text-[11px] text-stone-500 uppercase tracking-widest font-medium">
                  <span>Atelier Véra</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.subcategory}</span>
                </div>

                {/* Title */}
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-950 leading-tight">
                  {product.name}
                </h1>

                {/* Subtitle / Composition */}
                <p className="text-xs text-stone-600 font-light">{product.subtitle}</p>

                {/* Price & Rating Row */}
                <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xl font-medium text-stone-950 tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="font-mono text-sm text-stone-400 line-through tabular-nums">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setOpenAccordion('reviews');
                    }}
                    className="flex items-center gap-1.5 text-xs text-stone-700 hover:text-black"
                  >
                    <div className="flex items-center">
                      <Star size={13} className="fill-stone-900 text-stone-900" />
                    </div>
                    <span className="font-mono font-medium">{product.rating.toFixed(1)}</span>
                    <span className="text-stone-400 underline decoration-stone-300">
                      ({product.reviewCount} Reviews)
                    </span>
                  </button>
                </div>

                {/* Color Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="uppercase tracking-wider text-stone-600 font-medium">
                      Color:{' '}
                      <strong className="text-stone-950 font-normal">{selectedColor}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c) => {
                      const isSelected = selectedColor === c.name;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          title={c.name}
                          className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-stone-900 ring-offset-2 border-stone-800'
                              : 'border-stone-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {isSelected && (
                            <span
                              className={`w-2 h-2 rounded-full ${
                                c.hex === '#111111' || c.hex === '#2B1E1A'
                                  ? 'bg-white'
                                  : 'bg-stone-900'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="uppercase tracking-wider text-stone-600 font-medium">
                      Size
                    </span>
                    {product.category === 'clothing' && (
                      <button
                        type="button"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-black underline uppercase tracking-wider"
                      >
                        <Ruler size={12} />
                        <span>Sizing Guide</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-11 py-2 px-3 text-xs font-mono uppercase tracking-wider border transition-colors ${
                          selectedSize === sz
                            ? 'border-stone-900 bg-stone-900 text-white font-medium'
                            : 'border-stone-300 bg-white text-stone-700 hover:border-stone-500'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Urgency Indicator */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-stone-700">
                    {product.stockCount <= 5 ? (
                      <strong className="text-amber-800 font-medium">
                        Only {product.stockCount} pieces remaining in Florentine atelier
                      </strong>
                    ) : (
                      'In Stock — Ready for complimentary dispatch'
                    )}
                  </span>
                </div>

                {/* Quantity and Primary Actions */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-stone-300 bg-white h-12">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3.5 h-full text-stone-600 hover:text-black hover:bg-stone-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs w-8 text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                        className="px-3.5 h-full text-stone-600 hover:text-black hover:bg-stone-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Primary Add to Bag CTA */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="flex-1 h-12 bg-[#141414] hover:bg-black text-[#FAF9F6] text-xs uppercase tracking-[0.14em] font-medium flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      {addedSuccess ? (
                        <>
                          <Check size={16} className="text-emerald-400" />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          <span>Add to Shopping Bag</span>
                        </>
                      )}
                    </button>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label="Toggle wishlist"
                      className="w-12 h-12 border border-stone-300 bg-white hover:border-black flex items-center justify-center text-stone-700 hover:text-black transition-colors"
                    >
                      <Heart
                        size={18}
                        className={isWishlisted ? 'fill-[#141414] text-[#141414]' : ''}
                      />
                    </button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-stone-600 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-stone-900 shrink-0" />
                    <span>Complimentary Express Shipping over $300</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw size={14} className="text-stone-900 shrink-0" />
                    <span>30-Day Complimentary Returns</span>
                  </div>
                </div>
              </div>

              {/* Informational Accordion Sections */}
              <div className="border-t border-stone-200 divide-y divide-stone-200 pt-4 text-xs">
                {/* 01. Description & Craftsmanship */}
                <div>
                  <button
                    onClick={() => toggleAccordion('description')}
                    className="w-full py-3 flex items-center justify-between text-left font-medium text-stone-900 uppercase tracking-wider"
                  >
                    <span>01. Design & Architecture</span>
                    {openAccordion === 'description' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                  {openAccordion === 'description' && (
                    <div className="pb-4 text-stone-600 font-light space-y-2">
                      <p>{product.description}</p>
                      <ul className="list-disc pl-4 space-y-1 pt-1 text-stone-700">
                        {product.features.map((feat, idx) => (
                          <li key={idx}>{feat}</li>
                        ))}
                      </ul>
                      {product.dimensions && (
                        <p className="pt-1 text-stone-800 font-mono text-[11px]">
                          <strong>Dimensions:</strong> {product.dimensions}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 02. Material & Care */}
                <div>
                  <button
                    onClick={() => toggleAccordion('material')}
                    className="w-full py-3 flex items-center justify-between text-left font-medium text-stone-900 uppercase tracking-wider"
                  >
                    <span>02. Material & Provenance</span>
                    {openAccordion === 'material' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                  {openAccordion === 'material' && (
                    <div className="pb-4 text-stone-600 font-light space-y-2">
                      <p>
                        <strong className="text-stone-900 font-medium">Composition:</strong>{' '}
                        {product.material}
                      </p>
                      <div className="pt-1 space-y-1">
                        <strong className="text-stone-900 font-medium block">Atelier Care:</strong>
                        <ul className="list-disc pl-4 space-y-0.5 text-stone-700">
                          {product.care.map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* 03. Client Reviews (with live rating and write review trigger) */}
                <div>
                  <button
                    onClick={() => toggleAccordion('reviews')}
                    className="w-full py-3 flex items-center justify-between text-left font-medium text-stone-900 uppercase tracking-wider"
                  >
                    <span className="flex items-center gap-2">
                      <span>03. Verified Client Reviews</span>
                      <span className="font-mono text-stone-400">({product.reviews.length})</span>
                    </span>
                    {openAccordion === 'reviews' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                  {openAccordion === 'reviews' && (
                    <div className="pb-4">
                      <ReviewsSection
                        product={product}
                        onOpenWriteReview={() => setIsWriteReviewOpen(true)}
                        onVoteHelpful={onVoteHelpful}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        product={product}
        onSubmitReview={onAddReview}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />
    </>
  );
};
