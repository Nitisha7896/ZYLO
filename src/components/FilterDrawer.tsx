import React from 'react';
import { X, Check } from 'lucide-react';
import { FilterState, ProductCategory } from '../types';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  totalFilteredCount,
}) => {
  if (!isOpen) return null;

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'All Collections', value: 'all' },
    { label: 'Ready-to-Wear (Clothing)', value: 'clothing' },
    { label: 'Handcrafted Leather Bags', value: 'bags' },
    { label: 'Fine Accessories & Jewelry', value: 'accessories' },
  ];

  const subcategories = [
    'Tailoring',
    'Outerwear',
    'Dresses',
    'Knitwear',
    'Totes',
    'Shoulder Bags',
    'Fine Jewelry',
    'Leather Goods',
    'Fine Accessories',
  ];

  const colorOptions = [
    { name: 'Noir', hex: '#111111' },
    { name: 'Espresso', hex: '#2B1E1A' },
    { name: 'Camel Tan', hex: '#9B744A' },
    { name: 'Alabaster / Ecru', hex: '#EDE8DF' },
    { name: 'Charcoal', hex: '#2F3235' },
    { name: 'Warm Cognac', hex: '#7A4325' },
    { name: '24k Gold', hex: '#CFB53B' },
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];

  const materials = [
    'Virgin Wool',
    'Mongolian Cashmere',
    'Mulberry Silk',
    'Italian Calfskin',
    'English Bridle Leather',
    '24k Gold Vermeil',
  ];

  const toggleSubcategory = (sub: string) => {
    const next = filters.subcategories.includes(sub)
      ? filters.subcategories.filter((s) => s !== sub)
      : [...filters.subcategories, sub];
    onUpdateFilters({ subcategories: next });
  };

  const toggleColor = (col: string) => {
    const next = filters.colors.includes(col)
      ? filters.colors.filter((c) => c !== col)
      : [...filters.colors, col];
    onUpdateFilters({ colors: next });
  };

  const toggleSize = (sz: string) => {
    const next = filters.sizes.includes(sz)
      ? filters.sizes.filter((s) => s !== sz)
      : [...filters.sizes, sz];
    onUpdateFilters({ sizes: next });
  };

  const toggleMaterial = (mat: string) => {
    const next = filters.materials.includes(mat)
      ? filters.materials.filter((m) => m !== mat)
      : [...filters.materials, mat];
    onUpdateFilters({ materials: next });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#FAF9F6] h-full shadow-2xl flex flex-col z-10 border-l border-[#E8E6DF] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E6DF]">
          <div>
            <h2 className="font-serif text-2xl font-normal text-stone-900">Refine Collection</h2>
            <p className="text-xs text-stone-500 uppercase tracking-wider mt-0.5">
              Intuitive Curatorial Filters
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 text-stone-500 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 divide-y divide-stone-200/70">
          {/* Category Section */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-900 mb-3">
              Department
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat.value}
                  className="flex items-center justify-between text-sm text-stone-700 cursor-pointer hover:text-black py-1"
                >
                  <span>{cat.label}</span>
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat.value}
                    onChange={() => onUpdateFilters({ category: cat.value, subcategories: [] })}
                    className="accent-stone-900 w-4 h-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Subcategories */}
          <div className="pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-900 mb-3">
              Silhouette / Type
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {subcategories.map((sub) => {
                const isSelected = filters.subcategories.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubcategory(sub)}
                    className={`flex items-center justify-between px-3 py-2 border text-left transition-colors ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <span>{sub}</span>
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-900">
                Price Ceiling
              </h3>
              <span className="font-mono text-xs font-medium text-stone-900">
                ${filters.priceRange[0]} – ${filters.priceRange[1]}
              </span>
            </div>
            <input
              type="range"
              min="150"
              max="1200"
              step="25"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onUpdateFilters({
                  priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                })
              }
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-stone-500 mt-1">
              <span>$150 (Entry Acc.)</span>
              <span>$1,200 (Fine Cashmere)</span>
            </div>
          </div>

          {/* Color Palette */}
          <div className="pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-900 mb-3">
              Atelier Palette
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {colorOptions.map((c) => {
                const isSelected = filters.colors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => toggleColor(c.name)}
                    className={`flex items-center gap-2.5 px-3 py-2 border text-xs transition-colors ${
                      isSelected
                        ? 'border-stone-900 bg-stone-100 font-medium text-stone-900'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Filter */}
          <div className="pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-900 mb-3">
              Size
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {sizeOptions.map((sz) => {
                const isSelected = filters.sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`py-2 text-xs font-mono uppercase tracking-wider transition-colors border ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Material & Fiber */}
          <div className="pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-900 mb-3">
              Material & Provenance
            </h3>
            <div className="space-y-2">
              {materials.map((mat) => {
                const isSelected = filters.materials.includes(mat);
                return (
                  <label
                    key={mat}
                    className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer hover:text-black py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMaterial(mat)}
                      className="accent-stone-900 w-3.5 h-3.5"
                    />
                    <span>{mat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* In Stock Only Switch */}
          <div className="pt-6 pb-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-stone-900 uppercase tracking-wider">
                In-Stock Pieces Only
              </span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onUpdateFilters({ inStockOnly: e.target.checked })}
                className="accent-stone-900 w-4 h-4 cursor-pointer"
              />
            </label>
            <p className="text-[11px] text-stone-500 mt-1">
              Hides pre-order and atelier archival waiting-list pieces.
            </p>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 border-t border-[#E8E6DF] bg-white flex items-center gap-3">
          <button
            onClick={onResetFilters}
            className="flex-1 py-3 text-xs uppercase tracking-wider font-medium text-stone-600 border border-stone-300 hover:text-black hover:border-stone-400 transition-colors text-center"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 text-xs uppercase tracking-wider font-medium bg-[#141414] text-white hover:bg-black transition-colors text-center shadow-xs"
          >
            Show ({totalFilteredCount})
          </button>
        </div>
      </div>
    </div>
  );
};
