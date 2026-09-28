import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  currency: string;
  appliedPromo: string;
  discountRate: number;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  currency,
  appliedPromo,
  discountRate,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

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

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * discountRate);
  const freeShippingThreshold = 300;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 25;
  const estimatedTotal = subtotal - discountAmount + shippingCost;

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = onApplyPromo(promoInput.trim());
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-md bg-[#FAF9F6] h-full shadow-2xl flex flex-col z-10 border-l border-[#E8E6DF] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E6DF]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-stone-900" />
            <h2 className="font-serif text-2xl font-normal text-stone-900">Shopping Bag</h2>
            <span className="font-mono text-xs text-stone-500">
              ({items.reduce((acc, it) => acc + it.quantity, 0)})
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close shopping bag"
            className="p-1.5 text-stone-400 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#F0ECE1] px-6 py-3 border-b border-[#E2DFD6] text-xs">
          {remainingForFreeShipping > 0 ? (
            <p className="text-stone-700">
              Add <strong className="font-mono text-black font-semibold">{formatPrice(remainingForFreeShipping)}</strong> more to unlock <span className="font-medium">Complimentary Priority Shipping</span>.
            </p>
          ) : (
            <p className="text-emerald-900 font-medium flex items-center gap-1.5">
              <span>✦</span> You have qualified for Complimentary Priority Shipping.
            </p>
          )}
          <div className="w-full h-1.5 bg-stone-300 mt-2 overflow-hidden rounded-full">
            <div
              className="h-full bg-stone-900 transition-all duration-500"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Itemized List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-stone-200/70">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-stone-400">
                <ShoppingBag size={24} />
              </div>
              <h3 className="font-serif text-2xl text-stone-800">Your bag is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                Explore our latest collection of architectural tailoring, Italian leather bags, and artisanal accessories.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-wider font-medium"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-26 bg-stone-200 shrink-0 overflow-hidden">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-xs sm:text-sm text-stone-900 leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        aria-label="Remove item"
                        className="text-stone-400 hover:text-stone-800 transition-colors p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-500 mt-1 space-x-2 font-mono">
                      <span>Tone: {item.selectedColor}</span>
                      <span>·</span>
                      <span>Size: {item.selectedSize}</span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-stone-300 bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-black"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-black"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-xs sm:text-sm font-semibold text-stone-900 tabular-nums">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code Input */}
        {items.length > 0 && (
          <div className="px-6 py-3 border-t border-stone-200 bg-[#F7F5EE]">
            {appliedPromo ? (
              <div className="flex items-center justify-between text-xs bg-white p-2.5 border border-stone-300">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <Tag size={13} />
                  <span>
                    Promo Code <strong>{appliedPromo}</strong> applied ({discountRate * 100}% off)
                  </span>
                </div>
                <button
                  onClick={onRemovePromo}
                  className="text-stone-400 hover:text-black text-[11px] underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromoCode} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. ATELIER15)"
                    className="flex-1 bg-white border border-stone-300 px-3 py-1.5 text-xs uppercase placeholder:normal-case focus:outline-none focus:border-stone-900"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-black"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] ${
                      promoMessage.isError ? 'text-rose-700' : 'text-emerald-700'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
                <div className="text-[10px] text-stone-500">
                  Try test codes: <code className="bg-stone-200 px-1 py-0.5">ATELIER15</code> or{' '}
                  <code className="bg-stone-200 px-1 py-0.5">WELCOME10</code>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Drawer Order Summary & Checkout Trigger */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#E8E6DF] bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600 font-mono">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Atelier Courtesy ({appliedPromo})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Priority Shipping</span>
                <span>{shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between font-serif text-base text-stone-950 font-normal">
                <span>Estimated Total</span>
                <span className="font-mono font-semibold">{formatPrice(estimatedTotal)}</span>
              </div>
            </div>

            {/* Secure Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-[#141414] hover:bg-black text-[#FAF9F6] text-xs uppercase tracking-[0.16em] font-medium flex items-center justify-center gap-2 transition-all shadow-xs group"
            >
              <ShieldCheck size={16} />
              <span>Proceed to Secure Checkout</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-3 text-[10px] text-stone-400 font-mono tracking-wider pt-1">
              <span>SSL 256-BIT ENCRYPTION</span>
              <span>·</span>
              <span>PCI-DSS COMPLIANT</span>
              <span>·</span>
              <span>3D SECURE</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
