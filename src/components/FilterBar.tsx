import React from 'react';
import { SlidersHorizontal, Search, X, Check } from 'lucide-react';
import { FilterState, ProductCategory } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onOpenFilterDrawer: () => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  onOpenFilterDrawer,
  totalCount,
}) => {
  const categoryTabs: { label: string; value: ProductCategory }[] = [
    { label: 'All Collections', value: 'all' },
    { label: 'Ready-to-Wear', value: 'clothing' },
    { label: 'Handcrafted Bags', value: 'bags' },
    { label: 'Fine Accessories', value: 'accessories' },
  ];

  // Count active filters (excluding default category='all' and default sort)
  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    filters.subcategories.length +
    filters.colors.length +
    filters.sizes.length +
    filters.materials.length +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceRange[0] > 150 || filters.priceRange[1] < 1200 ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  const popularSuggestions = ['Tote', 'Cashmere', 'Blazer', 'Silk', 'Crescent Bag', 'Gold'];

  return (
    <div id="collection-grid" className="pt-10 pb-6 space-y-5">
      {/* Category Tabs & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E6DF] pb-4">
        {/* Interactive Segmented Category Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categoryTabs.map((tab) => {
            const isActive = filters.category === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onUpdateFilters({ category: tab.value, subcategories: [] })}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#181818] text-[#FAF9F6] shadow-xs'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Live Search Input with Clear Button */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            placeholder="Search tailored coat, bag, silk..."
            className="w-full bg-[#F4F2EC] border border-[#DDD9CF] pl-9 pr-8 py-2 text-xs tracking-wide placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          {filters.searchQuery && (
            <button
              onClick={() => onUpdateFilters({ searchQuery: '' })}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-800"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Secondary Controls Bar: Filter Drawer Button, Active Tags, Sort By, Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Slide-out Drawer Trigger */}
          <button
            onClick={onOpenFilterDrawer}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-stone-300 bg-white hover:border-black text-stone-800 font-medium tracking-wide uppercase transition-colors"
          >
            <SlidersHorizontal size={14} />
            <span>Filter Criteria</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-[#141414] text-white text-[10px] font-mono rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick Search Tag Suggestions when search is empty */}
          {!filters.searchQuery && (
            <div className="hidden sm:flex items-center gap-1.5 text-stone-500">
              <span className="text-[11px] uppercase tracking-wider text-stone-400">Popular:</span>
              {popularSuggestions.map((term) => (
                <button
                  key={term}
                  onClick={() => onUpdateFilters({ searchQuery: term })}
                  className="px-2 py-0.5 text-[11px] hover:text-black hover:underline transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {/* Total Pieces Count */}
          <span className="text-stone-500 font-serif italic text-sm">
            Showing {totalCount} {totalCount === 1 ? 'creation' : 'creations'}
          </span>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-stone-500 uppercase tracking-wider text-[11px]">
            Sort:
          </label>
          <select
            id="sort-select"
            value={filters.sortBy}
            onChange={(e) => onUpdateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
            className="bg-white border border-stone-300 py-1.5 px-3 text-xs tracking-wide text-stone-800 cursor-pointer focus:outline-none focus:border-stone-900"
          >
            <option value="featured">Atelier Curated</option>
            <option value="newest">New Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Client Rating</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips Bar (allows individual dismissal) */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-stone-400 uppercase tracking-wider text-[10px]">Active Filters:</span>

          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px]">
              Category: {filters.category}
              <button onClick={() => onUpdateFilters({ category: 'all' })}>
                <X size={12} className="hover:text-black" />
              </button>
            </span>
          )}

          {filters.subcategories.map((sub) => (
            <span
              key={sub}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px]"
            >
              {sub}
              <button
                onClick={() =>
                  onUpdateFilters({
                    subcategories: filters.subcategories.filter((s) => s !== sub),
                  })
                }
              >
                <X size={12} className="hover:text-black" />
              </button>
            </span>
          ))}

          {filters.colors.map((color) => (
            <span
              key={color}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px]"
            >
              Color: {color}
              <button
                onClick={() =>
                  onUpdateFilters({
                    colors: filters.colors.filter((c) => c !== color),
                  })
                }
              >
                <X size={12} className="hover:text-black" />
              </button>
            </span>
          ))}

          {filters.sizes.map((sz) => (
            <span
              key={sz}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px]"
            >
              Size: {sz}
              <button
                onClick={() =>
                  onUpdateFilters({
                    sizes: filters.sizes.filter((s) => s !== sz),
                  })
                }
              >
                <X size={12} className="hover:text-black" />
              </button>
            </span>
          ))}

          {filters.materials.map((mat) => (
            <span
              key={mat}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px]"
            >
              {mat}
              <button
                onClick={() =>
                  onUpdateFilters({
                    materials: filters.materials.filter((m) => m !== mat),
                  })
                }
              >
                <X size={12} className="hover:text-black" />
              </button>
            </span>
          ))}

          {(filters.priceRange[0] > 150 || filters.priceRange[1] < 1200) && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px]">
              ${filters.priceRange[0]} – ${filters.priceRange[1]}
              <button onClick={() => onUpdateFilters({ priceRange: [150, 1200] })}>
                <X size={12} className="hover:text-black" />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px]">
              In Stock Only
              <button onClick={() => onUpdateFilters({ inStockOnly: false })}>
                <X size={12} className="hover:text-black" />
              </button>
            </span>
          )}

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-200/80 text-stone-800 text-[11px]">
              Search: "{filters.searchQuery}"
              <button onClick={() => onUpdateFilters({ searchQuery: '' })}>
                <X size={12} className="hover:text-black" />
              </button>
            </span>
          )}

          <button
            onClick={onResetFilters}
            className="text-stone-500 hover:text-black underline text-[11px] ml-1 uppercase tracking-wider"
          >
            Reset All
          </button>
        </div>
      )}
    </div>
  );
};
