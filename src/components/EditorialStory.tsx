import React from 'react';
import { ArrowRight, Compass, Scissors, Feather } from 'lucide-react';

interface EditorialStoryProps {
  onExploreBags: () => void;
  onExploreClothing: () => void;
}

export const EditorialStory: React.FC<EditorialStoryProps> = ({
  onExploreBags,
  onExploreClothing,
}) => {
  return (
    <section className="py-16 lg:py-24 bg-[#F2EFE8] border-t border-[#E8E6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
            Atelier Manifesto
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-950 font-normal tracking-tight text-balance">
            Slow Luxury, Measured Craft
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
            Every creation is born from a rejection of seasonal obsolescence. We engineer architectural silhouettes with materials that gain character with age.
          </p>
        </div>

        {/* 2-Column Editorial Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Card 1: Tuscan Leather Tannery */}
          <div className="bg-white border border-[#E8E6DF] p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Compass size={18} />
                <span className="text-xs uppercase tracking-[0.16em] font-semibold">
                  Florence, Italy
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-stone-950 leading-snug">
                Vegetable-Tanned Italian Leather
              </h3>

              <p className="text-stone-600 text-sm font-light leading-relaxed">
                Our leather goods are sourced exclusively from Tuscan tanneries adhering to centuries-old bark and chestnut tanning recipes. Free of heavy metals and chromium, the leather develops an amber patina unique to each owner's journey.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-mono text-stone-700">
                <div className="border-l-2 border-stone-900 pl-3">
                  <span className="font-semibold block text-stone-900">Zero Synthetic Wax</span>
                  <span className="text-stone-500 text-[11px]">Breathe natural grain</span>
                </div>
                <div className="border-l-2 border-stone-900 pl-3">
                  <span className="font-semibold block text-stone-900">Solid Sand-Cast Brass</span>
                  <span className="text-stone-500 text-[11px]">Tarnish-resistant alloy</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={onExploreBags}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-stone-900 hover:text-black hover:translate-x-1 transition-all group"
              >
                <span>Explore Handcrafted Leather Bags</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Biella Wool Mills & Cashmere */}
          <div className="bg-white border border-[#E8E6DF] p-8 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-stone-900">
                <Scissors size={18} />
                <span className="text-xs uppercase tracking-[0.16em] font-semibold">
                  Biella & Ulaanbaatar
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-stone-950 leading-snug">
                Heritage Worsted Wool & Cashmere
              </h3>

              <p className="text-stone-600 text-sm font-light leading-relaxed">
                Spun in the foothills of the Italian Alps using pure alpine water, our worsted wool retains crisp crease memory while remaining breathable. Each coat incorporates hand-finished blind seams executed by master tailors.
              </p>

              <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-mono text-stone-700">
                <div className="border-l-2 border-stone-900 pl-3">
                  <span className="font-semibold block text-stone-900">100% Traceable Fiber</span>
                  <span className="text-stone-500 text-[11px]">Pasture-grazed integrity</span>
                </div>
                <div className="border-l-2 border-stone-900 pl-3">
                  <span className="font-semibold block text-stone-900">Double-Faced Seams</span>
                  <span className="text-stone-500 text-[11px]">Hand-split blind stitch</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200">
              <button
                onClick={onExploreClothing}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-medium text-stone-900 hover:text-black hover:translate-x-1 transition-all group"
              >
                <span>Discover Tailoring & Knitwear</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
