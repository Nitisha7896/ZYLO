import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { HERO_CAMPAIGN_IMAGE } from '../data/products';
import { ProductCategory } from '../types';

interface HeroProps {
  onExplore: (category?: ProductCategory) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  return (
    <section className="relative bg-[#F4F2EC] overflow-hidden border-b border-[#E8E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial Text Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 z-10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-600 font-medium">
              <span>Collection No. 07</span>
              <span aria-hidden="true">·</span>
              <span>Autumn / Winter</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#141414] leading-[1.08] font-normal tracking-tight text-balance">
              The Art of Modern Silhouette
            </h1>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              Sculptural worsted wool tailoring, double-faced Mongolian cashmere, and architectural vegetable-tanned leather goods engineered with Parisian restraint and Florentine craftsmanship.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => onExplore('all')}
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-[0.15em] font-medium transition-all shadow-sm group"
              >
                <span>Explore Collection</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onExplore('bags')}
                className="inline-flex items-center justify-center px-7 py-3.5 bg-transparent border border-stone-800 text-stone-900 hover:bg-stone-900 hover:text-white text-xs uppercase tracking-[0.15em] font-medium transition-colors"
              >
                Discover Handbags
              </button>
            </div>

            {/* Adjacent Trust Proof Callouts */}
            <div className="pt-6 border-t border-stone-300/70 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block font-serif text-xl text-stone-900">100%</span>
                <span className="text-[11px] text-stone-600 leading-tight uppercase tracking-wider block mt-0.5">
                  Virgin Biella Wool & Silk
                </span>
              </div>
              <div>
                <span className="block font-serif text-xl text-stone-900">Florence</span>
                <span className="text-[11px] text-stone-600 leading-tight uppercase tracking-wider block mt-0.5">
                  Artisanal Leather Atelier
                </span>
              </div>
              <div>
                <span className="block font-serif text-xl text-stone-900">30-Day</span>
                <span className="text-[11px] text-stone-600 leading-tight uppercase tracking-wider block mt-0.5">
                  Complimentary Returns
                </span>
              </div>
            </div>
          </div>

          {/* Campaign Image Column (7 cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/10] lg:aspect-[16/11] bg-stone-200 overflow-hidden shadow-xs">
              <img
                src={HERO_CAMPAIGN_IMAGE}
                alt="Atelier Véra Autumn/Winter Campaign look featuring tailored wool trench and structured leather handbag"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition-transform duration-700 ease-out"
                onError={(e) => {
                  // Fallback styling container if needed
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Subtle Campaign Tag in Corner */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-light tracking-widest drop-shadow-md">
                <span className="uppercase">Lookbook Look 01 · Paris</span>
                <span className="font-mono text-[11px] opacity-90">Parisian Atelier Archive</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Ribbon */}
      <div className="bg-[#EFECE5] border-t border-[#E2DFD6] py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs text-stone-700 tracking-wider uppercase font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-stone-900" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Sparkles size={14} className="text-stone-900" />
            <span>Master Leather Craftsmanship</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className="text-stone-900" />
            <span>Complimentary Global Exchanges</span>
          </div>
        </div>
      </div>
    </section>
  );
};
