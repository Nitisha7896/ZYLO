import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { FilterDrawer } from './components/FilterDrawer';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { EditorialStory } from './components/EditorialStory';
import { Footer } from './components/Footer';
import { INITIAL_PRODUCTS } from './data/products';
import { Product, CartItem, FilterState, ProductCategory, Review, CheckoutOrder } from './types';
import { Check, Heart, ShoppingBag, Sparkles } from 'lucide-react';

export default function App() {
  // Products State (initialized with INITIAL_PRODUCTS or localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_vera_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === INITIAL_PRODUCTS.length && parsed[0]?.id) {
          // Re-sync image URLs from INITIAL_PRODUCTS to clear any stale paths
          return parsed.map((p, idx) => ({
            ...p,
            images: INITIAL_PRODUCTS[idx]?.images || p.images,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_vera_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.product?.id) {
          return parsed.map((item) => {
            const freshProd = INITIAL_PRODUCTS.find((p) => p.id === item.product?.id) || item.product;
            return {
              ...item,
              product: freshProd,
            };
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'cart-init-1',
        product: INITIAL_PRODUCTS[0], // The Grand Palais Leather Tote
        selectedColor: 'Espresso',
        selectedSize: 'One Size',
        quantity: 1,
      },
    ];
  });

  // Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_vera_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [INITIAL_PRODUCTS[1].id]; // Wool blazer
  });

  // Currency
  const [currency, setCurrency] = useState<string>('USD');

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<number>(0);

  // UI Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('atelier_vera_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('atelier_vera_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('atelier_vera_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    subcategories: [],
    priceRange: [150, 1200],
    colors: [],
    sizes: [],
    materials: [],
    inStockOnly: false,
    searchQuery: '',
    sortBy: 'featured',
  });

  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      subcategories: [],
      priceRange: [150, 1200],
      colors: [],
      sizes: [],
      materials: [],
      inStockOnly: false,
      searchQuery: '',
      sortBy: 'featured',
    });
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (filters.category !== 'all' && p.category !== filters.category) return false;

        // Subcategories
        if (
          filters.subcategories.length > 0 &&
          !filters.subcategories.includes(p.subcategory)
        ) {
          return false;
        }

        // Price range
        if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;

        // Colors
        if (
          filters.colors.length > 0 &&
          !p.colors.some((c) => filters.colors.includes(c.name))
        ) {
          return false;
        }

        // Sizes
        if (
          filters.sizes.length > 0 &&
          !p.sizes.some((s) => filters.sizes.includes(s))
        ) {
          return false;
        }

        // Materials
        if (
          filters.materials.length > 0 &&
          !filters.materials.some((m) =>
            p.material.toLowerCase().includes(m.toLowerCase())
          )
        ) {
          return false;
        }

        // In Stock Only
        if (filters.inStockOnly && !p.inStock) return false;

        // Search Query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchTitle = p.name.toLowerCase().includes(q);
          const matchSub = p.subcategory.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchMat = p.material.toLowerCase().includes(q);
          if (!matchTitle && !matchSub && !matchDesc && !matchMat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'featured':
          default:
            return 0;
        }
      });
  }, [products, filters]);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    selectedColor: string,
    selectedSize: string,
    quantity: number
  ) => {
    const existingIndex = cartItems.findIndex(
      (it) =>
        it.product.id === product.id &&
        it.selectedColor === selectedColor &&
        it.selectedSize === selectedSize
    );

    if (existingIndex >= 0) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        product,
        selectedColor,
        selectedSize,
        quantity,
      };
      setCartItems((prev) => [...prev, newItem]);
    }

    showToast(`Added "${product.name}" to shopping bag`);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
    showToast('Item removed from shopping bag');
  };

  // Wishlist Handlers
  const handleToggleWishlist = (productId: string) => {
    if (wishlistIds.includes(productId)) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from saved creations');
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      showToast('Saved to your private curation');
    }
  };

  const handleMoveWishlistToBag = (product: Product) => {
    handleAddToCart(product, product.colors[0]?.name || '', product.sizes[0] || 'One Size', 1);
    setWishlistIds((prev) => prev.filter((id) => id !== product.id));
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  // Promo Code Handlers
  const handleApplyPromo = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'ATELIER15') {
      setAppliedPromo('ATELIER15');
      setDiscountRate(0.15);
      showToast('15% Atelier Privilege applied');
      return { success: true, message: '15% Atelier Privilege discount applied successfully.' };
    }
    if (normalized === 'WELCOME10') {
      setAppliedPromo('WELCOME10');
      setDiscountRate(0.10);
      showToast('10% Welcome Courtesy applied');
      return { success: true, message: '10% Welcome discount applied successfully.' };
    }
    if (normalized === 'PARIS20') {
      setAppliedPromo('PARIS20');
      setDiscountRate(0.20);
      showToast('20% Autumn Salon privilege applied');
      return { success: true, message: '20% Autumn Salon privilege applied.' };
    }
    return { success: false, message: 'Invalid promo code. Valid test codes: ATELIER15 or WELCOME10.' };
  };

  const handleRemovePromo = () => {
    setAppliedPromo('');
    setDiscountRate(0);
    showToast('Promo code removed');
  };

  // Review System Handlers
  const handleAddReview = (productId: string, review: Review) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [review, ...p.reviews];
          const newAvg =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            rating: Math.round(newAvg * 10) / 10,
          };
        }
        return p;
      })
    );

    if (activeQuickViewProduct && activeQuickViewProduct.id === productId) {
      const updatedReviews = [review, ...activeQuickViewProduct.reviews];
      const newAvg =
        updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
      setActiveQuickViewProduct({
        ...activeQuickViewProduct,
        reviews: updatedReviews,
        reviewCount: updatedReviews.length,
        rating: Math.round(newAvg * 10) / 10,
      });
    }

    showToast('Your verified client review has been recorded');
  };

  const handleVoteHelpful = (productId: string, reviewId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = p.reviews.map((r) => {
            if (r.id === reviewId) {
              const voted = !r.userHelpfulVoted;
              return {
                ...r,
                helpfulCount: voted ? r.helpfulCount + 1 : r.helpfulCount - 1,
                userHelpfulVoted: voted,
              };
            }
            return r;
          });
          return { ...p, reviews: updatedReviews };
        }
        return p;
      })
    );

    if (activeQuickViewProduct && activeQuickViewProduct.id === productId) {
      const updatedReviews = activeQuickViewProduct.reviews.map((r) => {
        if (r.id === reviewId) {
          const voted = !r.userHelpfulVoted;
          return {
            ...r,
            helpfulCount: voted ? r.helpfulCount + 1 : r.helpfulCount - 1,
            userHelpfulVoted: voted,
          };
        }
        return r;
      });
      setActiveQuickViewProduct({ ...activeQuickViewProduct, reviews: updatedReviews });
    }
  };

  const handleOrderCompleted = (order: CheckoutOrder) => {
    // Clear cart upon order completion
    setCartItems([]);
    setAppliedPromo('');
    setDiscountRate(0);
    showToast(`Order ${order.orderId} confirmed with 256-bit encryption`);
  };

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#141414]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141414] text-white px-5 py-3 text-xs tracking-wider uppercase font-medium shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-2 duration-200">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Navbar
        activeCategory={filters.category}
        onSelectCategory={(cat) => {
          handleUpdateFilters({ category: cat, subcategories: [] });
        }}
        cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => {
          const el = document.getElementById('collection-grid');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenEditorial={() => {
          const el = document.getElementById('atelier-editorial');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        currency={currency}
        onChangeCurrency={setCurrency}
      />

      <main className="flex-1">
        {/* Campaign Hero Section */}
        <Hero
          onExplore={(cat) => {
            if (cat) handleUpdateFilters({ category: cat });
            const el = document.getElementById('collection-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Featured Collection Section (3-column desktop product grid with generous whitespace) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FilterBar
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onResetFilters={handleResetFilters}
            onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
            totalCount={filteredProducts.length}
          />

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="font-serif text-2xl text-stone-800">
                No creations match the selected criteria
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Adjust your active filters or clear search to explore our complete ready-to-wear and handbag collections.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-3 px-6 py-2.5 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-wider font-medium"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 pb-16">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={(p) => setActiveQuickViewProduct(p)}
                  onQuickAdd={(p, color, size) => handleAddToCart(p, color, size, 1)}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                  currency={currency}
                />
              ))}
            </div>
          )}
        </div>

        {/* Editorial Story / Craftsmanship Section */}
        <div id="atelier-editorial">
          <EditorialStory
            onExploreBags={() => {
              handleUpdateFilters({ category: 'bags' });
              const el = document.getElementById('collection-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onExploreClothing={() => {
              handleUpdateFilters({ category: 'clothing' });
              const el = document.getElementById('collection-grid');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </main>

      {/* Boutique Footer */}
      <Footer
        onSelectCategory={(cat) => {
          handleUpdateFilters({ category: cat });
          const el = document.getElementById('collection-grid');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        currency={currency}
        onChangeCurrency={setCurrency}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredProducts.length}
      />

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={activeQuickViewProduct}
        isOpen={!!activeQuickViewProduct}
        onClose={() => setActiveQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={activeQuickViewProduct ? wishlistIds.includes(activeQuickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        currency={currency}
        onVoteHelpful={handleVoteHelpful}
        onAddReview={handleAddReview}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        currency={currency}
        appliedPromo={appliedPromo}
        discountRate={discountRate}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToBag={handleMoveWishlistToBag}
        currency={currency}
      />

      {/* Secure Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        appliedPromo={appliedPromo}
        discountRate={discountRate}
        onOrderCompleted={handleOrderCompleted}
      />
    </div>
  );
}
