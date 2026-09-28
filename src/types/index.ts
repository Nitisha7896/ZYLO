export type ProductCategory = 'all' | 'clothing' | 'bags' | 'accessories';

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  content: string;
  fit: 'Runs Small' | 'True to Size' | 'Runs Large';
  qualityScore: number;
  helpfulCount: number;
  userHelpfulVoted?: boolean;
  photos?: string[];
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'clothing' | 'bags' | 'accessories';
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  material: string;
  description: string;
  features: string[];
  dimensions?: string;
  care: string[];
  inStock: boolean;
  stockCount: number;
  badge?: string;
  reviews: Review[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface FilterState {
  category: ProductCategory;
  subcategories: string[];
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  materials: string[];
  inStockOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  eta: string;
  description: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutOrder {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingMethod: ShippingMethod;
  tax: number;
  total: number;
  promoCode?: string;
  shippingAddress: ShippingAddress;
  paymentDetails: {
    method: 'card' | 'apple_pay' | 'google_pay';
    cardLast4: string;
    cardBrand: string;
  };
  createdAt: string;
}
