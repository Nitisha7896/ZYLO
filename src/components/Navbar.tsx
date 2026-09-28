import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, X, Menu } from 'lucide-react';
import { ProductCategory } from '../types';

interface NavbarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenEditorial: () => void;
  currency: string;
  onChangeCurrency: (curr: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenEditorial,
  currency,
  onChangeCurrency,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const navLinks: { label: string; cat: ProductCategory; isEditorial?: boolean }[] = [
    { label: 'All Pieces', cat: 'all' },
    { label: 'Ready-to-Wear', cat: 'clothing' },
    { label: 'Leather Bags', cat: 'bags' },
    { label: 'Accessories', cat: 'accessories' },
    { label: 'Atelier Stories', cat: 'all', isEditorial: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8E6DF] transition-all">
      {/* Slim Promotional Announcement Banner (dismissible, <= 40px) */}
      {!bannerDismissed && (
        <div className="bg-[#1C1C1C] text-[#F3F2EE] px-4 py-2 text-xs flex items-center justify-between font-light tracking-wider">
          <div className="mx-auto flex items-center gap-3 truncate">
            <span className="font-medium text-[#E5D5C5]">ATELIER VÉRA</span>
            <span aria-hidden="true" className="text-stone-500">·</span>
            <span className="truncate">Complimentary priority shipping on orders over $300 · All duties included</span>
          </div>
          <button
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss announcement"
            className="text-stone-400 hover:text-white transition-colors ml-2"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Bar Contract: Zone 1 (Brand), Zone 2 (4-5 Nav Links), Zone 3 (1-2 Primary Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-1.5 text-stone-800 hover:text-black transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <button
            onClick={onOpenSearch}
            aria-label="Search collection"
            className="p-1.5 text-stone-800 hover:text-black transition-colors"
          >
            <Search size={19} />
          </button>
        </div>

        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center">
          <button
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group text-left"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-medium uppercase text-[#141414] hover:opacity-85 transition-opacity">
              Atelier Véra
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 clean text navigation links with subtle underlines */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.08em] uppercase font-medium text-stone-600">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.isEditorial) {
                  onOpenEditorial();
                } else {
                  onSelectCategory(item.cat);
                  const el = document.getElementById('collection-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`relative py-1 transition-colors whitespace-nowrap hover:text-[#111] ${
                activeCategory === item.cat && !item.isEditorial
                  ? 'text-[#111] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#111]'
                  : 'text-stone-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions (Currency, Search, Wishlist, Shopping Bag) */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Currency Selector */}
          <div className="hidden sm:flex items-center text-xs font-mono text-stone-600 tracking-wider">
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value)}
              aria-label="Select currency"
              className="bg-transparent border-none py-1 pr-1 pl-0 text-xs font-medium cursor-pointer hover:text-black focus:outline-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          {/* Desktop Search Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Search luxury pieces"
            className="hidden lg:flex items-center gap-2 text-stone-700 hover:text-black px-2 py-1.5 transition-colors"
          >
            <Search size={18} />
            <span className="text-xs uppercase tracking-wider font-medium text-stone-500">Search</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            aria-label="View wishlist"
            className="relative p-2 text-stone-800 hover:text-black transition-colors"
          >
            <Heart size={20} className={wishlistCount > 0 ? 'fill-stone-900 text-stone-900' : ''} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#141414] text-white text-[10px] font-mono rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Bag Drawer Trigger */}
          <button
            onClick={onOpenCart}
            aria-label="View shopping bag"
            className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] hover:bg-black text-[#FAF9F6] text-xs font-medium uppercase tracking-wider rounded-none transition-all shadow-xs"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono text-[11px] bg-white/20 px-1.5 py-0.5 rounded-xs">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E6DF] bg-[#FAF9F6] px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.isEditorial) {
                    onOpenEditorial();
                  } else {
                    onSelectCategory(item.cat);
                    const el = document.getElementById('collection-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm tracking-wider uppercase py-2 border-b border-stone-200/60 ${
                  activeCategory === item.cat && !item.isEditorial
                    ? 'font-semibold text-black'
                    : 'text-stone-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-stone-600">
            <span className="uppercase tracking-wider">Currency:</span>
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value)}
              className="bg-transparent border border-stone-300 px-2 py-1 text-xs"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
