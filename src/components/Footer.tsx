import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, Lock } from 'lucide-react';
import { ProductCategory } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  currency: string;
  onChangeCurrency: (curr: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  currency,
  onChangeCurrency,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-[#141414] text-[#FAF9F6] border-t border-stone-800">
      {/* Top Newsletter & Atelier Dispatch */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-stone-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium">
              Private Salon Gazette
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-white">
              The Atelier Journal
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm font-light max-w-md leading-relaxed">
              Receive private invitations to seasonal trunk shows, limited leather allocations, and essays on architectural design.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 bg-stone-900 border border-emerald-900/60 text-emerald-400 text-xs flex items-center gap-2">
                <Check size={16} />
                <span>You have been inscribed into the private salon registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 bg-stone-900 border border-stone-700 px-4 py-3 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-black hover:bg-[#F0ECE1] text-xs uppercase tracking-[0.14em] font-medium transition-colors whitespace-nowrap"
                >
                  Join Registry
                </button>
              </form>
            )}
            <p className="text-[11px] text-stone-500 mt-2 font-light">
              We respect your privacy. Frequency: approximately twice monthly.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Col 1: House Navigation */}
          <div className="space-y-4">
            <span className="font-serif text-base text-white tracking-wider block">
              Collections
            </span>
            <ul className="space-y-2.5 text-stone-400 font-light">
              <li>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-white transition-colors"
                >
                  All Creations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('clothing')}
                  className="hover:text-white transition-colors"
                >
                  Ready-to-Wear Tailoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('bags')}
                  className="hover:text-white transition-colors"
                >
                  Handcrafted Leather Bags
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('accessories')}
                  className="hover:text-white transition-colors"
                >
                  Fine Jewelry & Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Client Concierge */}
          <div className="space-y-4">
            <span className="font-serif text-base text-white tracking-wider block">
              Client Concierge
            </span>
            <ul className="space-y-2.5 text-stone-400 font-light">
              <li>Complimentary Global Shipping</li>
              <li>30-Day Returns & Exchanges</li>
              <li>Atelier Leather Restoration</li>
              <li>Virtual Fit Consultation</li>
              <li>Certificate of Authenticity</li>
            </ul>
          </div>

          {/* Col 3: Boutiques & Salons */}
          <div className="space-y-4">
            <span className="font-serif text-base text-white tracking-wider block">
              Atelier Boutiques
            </span>
            <ul className="space-y-2.5 text-stone-400 font-light">
              <li>Paris — 14 Rue de Tournon</li>
              <li>Milan — Via Montenapoleone 8</li>
              <li>New York — 92 Mercer Street</li>
              <li>Tokyo — Ginza 6-Chome</li>
            </ul>
          </div>

          {/* Col 4: Ethics & Craft */}
          <div className="space-y-4">
            <span className="font-serif text-base text-white tracking-wider block">
              Ethical Provenance
            </span>
            <p className="text-stone-400 leading-relaxed font-light">
              All leather is a byproduct of European agriculture, vegetable-tanned with plant tannins in Florence. Zero chrome, zero plastic coating.
            </p>
            <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px] pt-1">
              <Lock size={12} className="text-emerald-500" />
              <span>PCI-DSS Level 1 Verified Store</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
          <div>
            © {new Date().getFullYear()} ATELIER VÉRA S.A.S. ALL RIGHTS RESERVED.
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span>Currency:</span>
              <select
                value={currency}
                onChange={(e) => onChangeCurrency(e.target.value)}
                aria-label="Footer currency selector"
                className="bg-stone-900 border border-stone-700 text-stone-300 px-2 py-0.5 text-[11px]"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <span>·</span>
            <span className="text-stone-400">PARIS · FLORENCE · NEW YORK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
