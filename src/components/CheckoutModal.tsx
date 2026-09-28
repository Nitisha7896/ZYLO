import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  Printer,
  ChevronRight,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { CartItem, CheckoutOrder, ShippingAddress, ShippingMethod } from '../types';
import { SHIPPING_METHODS } from '../data/products';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: string;
  appliedPromo: string;
  discountRate: number;
  onOrderCompleted: (order: CheckoutOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  appliedPromo,
  discountRate,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  // Checkout Steps: 1: Shipping Address, 2: Delivery Option, 3: Payment, 4: Confirmation Receipt
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<CheckoutOrder | null>(null);

  // Form State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>(
    SHIPPING_METHODS[0]
  );

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Calculations
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
  const tax = Math.round((subtotal - discountAmount) * 0.08);
  const shippingCost = selectedShippingMethod.price;
  const total = subtotal - discountAmount + shippingCost + tax;

  // Quick Autofill for Test Evaluation
  const fillDemoInformation = () => {
    setShippingAddress({
      fullName: 'Geneviève Moreau',
      email: 'genevieve.moreau@atelier-client.com',
      phone: '+1 (555) 382-9104',
      addressLine1: '742 Evergreen Terrace, Apt 4B',
      addressLine2: 'Historic District',
      city: 'New York',
      state: 'NY',
      postalCode: '10012',
      country: 'United States',
    });
    setCardNumber('4532 •••• •••• 8912');
    setCardExpiry('08/29');
    setCardCvv('782');
    setCardHolder('Geneviève Moreau');
  };

  // Submit step 1
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.email || !shippingAddress.addressLine1) return;
    setStep(2);
  };

  // Process order in step 3
  const handleFinalPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const order: CheckoutOrder = {
        orderId: `AV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        items: [...items],
        subtotal,
        discount: discountAmount,
        shippingMethod: selectedShippingMethod,
        tax,
        total,
        promoCode: appliedPromo || undefined,
        shippingAddress: { ...shippingAddress },
        paymentDetails: {
          method: paymentMethod,
          cardLast4: cardNumber ? cardNumber.slice(-4) : '8912',
          cardBrand: paymentMethod === 'card' ? 'Visa Signature' : paymentMethod,
        },
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      setConfirmedOrder(order);
      setIsProcessing(false);
      setStep(4);
      onOrderCompleted(order);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-[#FAF9F6] w-full max-w-4xl max-h-[92vh] shadow-2xl z-10 border border-[#E8E6DF] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E6DF] flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl sm:text-2xl font-medium tracking-wider uppercase text-stone-900">
              Atelier Véra
            </span>
            <span className="hidden sm:inline text-stone-300">|</span>
            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-mono">
              <Lock size={12} className="text-emerald-700" />
              <span>256-Bit Encrypted Secure Checkout</span>
            </div>
          </div>

          {step !== 4 && (
            <button
              onClick={onClose}
              aria-label="Close checkout"
              className="text-stone-400 hover:text-black p-1"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Step Indicator (if not completed) */}
        {step !== 4 && (
          <div className="bg-[#F4F2EC] px-6 py-3 border-b border-[#E8E6DF] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-4 sm:gap-6">
              <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-black font-semibold' : 'text-stone-500'}`}>
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Shipping Address</span>
              </span>
              <ChevronRight size={14} className="text-stone-400" />
              <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-black font-semibold' : 'text-stone-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-stone-900 text-white' : 'bg-stone-300 text-stone-700'}`}>2</span>
                <span>Delivery</span>
              </span>
              <ChevronRight size={14} className="text-stone-400" />
              <span className={`flex items-center gap-1.5 ${step === 3 ? 'text-black font-semibold' : 'text-stone-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-stone-900 text-white' : 'bg-stone-300 text-stone-700'}`}>3</span>
                <span>Payment</span>
              </span>
            </div>

            <button
              type="button"
              onClick={fillDemoInformation}
              className="text-[11px] underline text-stone-600 hover:text-black"
            >
              Autofill Demo Client
            </button>
          </div>
        )}

        {/* Checkout Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Action Area (7 cols if step < 4, 12 cols if step 4) */}
          <div className={`${step === 4 ? 'col-span-12' : 'lg:col-span-7'} p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#E8E6DF]`}>
            {/* STEP 1: SHIPPING ADDRESS */}
            {step === 1 && (
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="border-b border-stone-200 pb-2">
                  <h3 className="font-serif text-xl text-stone-900">1. Client & Delivery Destination</h3>
                  <p className="text-xs text-stone-500">All luxury shipments are insured in signature Atelier boxes.</p>
                </div>

                {/* Express Checkout Options */}
                <div className="pt-1">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 block mb-2">
                    Express 1-Tap Checkout
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        fillDemoInformation();
                        setPaymentMethod('apple_pay');
                        setStep(3);
                      }}
                      className="py-2.5 bg-black text-white hover:bg-stone-900 text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Smartphone size={14} />
                      <span>Apple Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        fillDemoInformation();
                        setPaymentMethod('google_pay');
                        setStep(3);
                      }}
                      className="py-2.5 bg-white border border-stone-300 hover:border-black text-stone-900 text-xs font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Google Pay</span>
                    </button>
                  </div>
                  <div className="relative my-4 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-stone-200" />
                    </div>
                    <span className="relative bg-[#FAF9F6] px-2 text-[10px] text-stone-400 uppercase tracking-widest font-mono">
                      or deliver with atelier concierge
                    </span>
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      placeholder="e.g. Geneviève Moreau"
                      className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      placeholder="e.g. genevieve@example.com"
                      className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                    Street Address & Suite / Apt *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900 mb-2"
                  />
                  <input
                    type="text"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                    placeholder="Apartment, suite, unit (optional)"
                    className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="New York"
                      className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                      State / Region *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="NY"
                      className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      placeholder="10012"
                      className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                      Country
                    </label>
                    <select
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900 cursor-pointer"
                    >
                      <option value="United States">United States</option>
                      <option value="France">France</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Italy">Italy</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Japan">Japan</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                      Phone Number (For Courier)
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-[0.14em] font-medium transition-colors shadow-xs"
                  >
                    Continue to Delivery Method
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: DELIVERY METHOD */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="border-b border-stone-200 pb-2">
                  <h3 className="font-serif text-xl text-stone-900">2. Select Delivery Service</h3>
                  <p className="text-xs text-stone-500">Delivered directly to {shippingAddress.city}, {shippingAddress.country}.</p>
                </div>

                <div className="space-y-3">
                  {SHIPPING_METHODS.map((method) => {
                    const isSelected = selectedShippingMethod.id === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedShippingMethod(method)}
                        className={`p-4 border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-stone-900 bg-stone-100/70 ring-1 ring-stone-900'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Truck size={15} className="text-stone-900" />
                            <span className="font-medium text-xs text-stone-900 uppercase tracking-wider">
                              {method.name}
                            </span>
                          </div>
                          <span className="font-mono text-xs font-semibold text-stone-900">
                            {method.price === 0 ? 'Complimentary' : formatPrice(method.price)}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 pl-6">{method.description}</p>
                        <div className="pl-6 pt-1 text-[11px] font-mono text-stone-500">
                          Estimated Arrival: {method.eta}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs uppercase tracking-wider text-stone-600 hover:text-black"
                  >
                    ← Back to Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-8 py-3 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-[0.14em] font-medium transition-colors shadow-xs"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {step === 3 && (
              <form onSubmit={handleFinalPayment} className="space-y-5">
                <div className="border-b border-stone-200 pb-2">
                  <h3 className="font-serif text-xl text-stone-900">3. Secure Encrypted Payment</h3>
                  <p className="text-xs text-stone-500">All data is tokenized via PCI-DSS compliant vaulting.</p>
                </div>

                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 border text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`py-2 px-3 border text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'apple_pay'
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <Smartphone size={14} />
                    <span>Apple Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('google_pay')}
                    className={`py-2 px-3 border text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                      paymentMethod === 'google_pay'
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <span>Google Pay</span>
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-3 bg-[#F7F5EE] p-4 border border-stone-300">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 8912 3409 8912"
                        className="w-full bg-white border border-stone-300 px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                          Expiry (MM/YY) *
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/29"
                          className="w-full bg-white border border-stone-300 px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                          Security CVV *
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="782"
                          className="w-full bg-white border border-stone-300 px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-stone-700 font-medium block mb-1">
                        Name on Card *
                      </label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Geneviève Moreau"
                        className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-white border border-stone-300 text-center space-y-2">
                    <ShieldCheck size={28} className="text-stone-900 mx-auto" />
                    <p className="text-xs text-stone-700 font-medium">
                      One-touch authorization with biometric 3D verification.
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Your default payment credentials stored securely with {paymentMethod === 'apple_pay' ? 'Apple' : 'Google'} will be billed.
                    </p>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs uppercase tracking-wider text-stone-600 hover:text-black"
                  >
                    ← Back to Delivery
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-8 py-3.5 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-[0.16em] font-medium transition-all shadow-xs disabled:opacity-50 flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authorizing 3D Secure...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={13} />
                        <span>Authorize Payment ({formatPrice(total)})</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: ORDER CONFIRMATION RECEIPT */}
            {step === 4 && confirmedOrder && (
              <div className="space-y-8 max-w-2xl mx-auto py-4">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 size={30} />
                  </div>
                  <span className="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
                    Order Confirmed & Inscribed
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal">
                    Merci, {confirmedOrder.shippingAddress.fullName.split(' ')[0]}
                  </h2>
                  <p className="text-xs text-stone-600 max-w-md mx-auto">
                    Your acquisition has been registered with our Paris & Florence ateliers. A confirmation and tracking dossier has been dispatched to <strong>{confirmedOrder.shippingAddress.email}</strong>.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-white border border-[#E5E2D9] p-6 space-y-5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between border-b border-stone-200 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-mono">
                        Official Atelier Order
                      </span>
                      <span className="font-mono text-base font-semibold text-stone-900">
                        {confirmedOrder.orderId}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-mono">
                        Date of Acquisition
                      </span>
                      <span className="font-mono text-xs text-stone-700">
                        {confirmedOrder.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Items purchased */}
                  <div className="space-y-3 divide-y divide-stone-100">
                    {confirmedOrder.items.map((it) => (
                      <div key={it.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.product.images[0]}
                            alt={it.product.name}
                            className="w-12 h-16 object-cover bg-stone-100"
                          />
                          <div>
                            <h4 className="font-medium text-stone-900">{it.product.name}</h4>
                            <p className="text-[11px] text-stone-500 font-mono">
                              Tone: {it.selectedColor} · Size: {it.selectedSize} · Qty: {it.quantity}
                            </p>
                          </div>
                        </div>

                        <span className="font-mono font-medium text-stone-900 tabular-nums">
                          {formatPrice(it.product.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals Breakdown */}
                  <div className="border-t border-stone-200 pt-3 space-y-1.5 text-xs font-mono text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(confirmedOrder.subtotal)}</span>
                    </div>
                    {confirmedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-800">
                        <span>Courtesy Privilege ({confirmedOrder.promoCode})</span>
                        <span>-{formatPrice(confirmedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Service ({confirmedOrder.shippingMethod.name})</span>
                      <span>
                        {confirmedOrder.shippingMethod.price === 0
                          ? 'Complimentary'
                          : formatPrice(confirmedOrder.shippingMethod.price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Value-Added Tax (8%)</span>
                      <span>{formatPrice(confirmedOrder.tax)}</span>
                    </div>
                    <div className="pt-2 border-t border-stone-200 flex justify-between font-serif text-lg text-stone-950 font-normal">
                      <span>Total Settled</span>
                      <span className="font-mono font-semibold">{formatPrice(confirmedOrder.total)}</span>
                    </div>
                  </div>

                  {/* Destination Info */}
                  <div className="border-t border-stone-200 pt-3 text-xs text-stone-600">
                    <span className="font-semibold uppercase tracking-wider text-[11px] text-stone-900 block mb-1">
                      Insured Delivery Destination:
                    </span>
                    <p className="font-light">
                      {confirmedOrder.shippingAddress.fullName} · {confirmedOrder.shippingAddress.addressLine1}
                      {confirmedOrder.shippingAddress.addressLine2 ? `, ${confirmedOrder.shippingAddress.addressLine2}` : ''},{' '}
                      {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state}{' '}
                      {confirmedOrder.shippingAddress.postalCode}, {confirmedOrder.shippingAddress.country}
                    </p>
                  </div>
                </div>

                {/* Post-order actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-stone-300 bg-white hover:border-black text-xs uppercase tracking-wider text-stone-800 font-medium"
                  >
                    <Printer size={14} />
                    <span>Print Order Receipt</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-8 py-2.5 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-[0.14em] font-medium"
                  >
                    Continue Exploring
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Order Summary (visible in steps 1, 2, 3) */}
          {step !== 4 && (
            <div className="lg:col-span-5 bg-[#F5F3EC] p-6 sm:p-8 space-y-6">
              <h3 className="font-serif text-xl text-stone-900">Order Summary</h3>

              {/* Items list */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((it) => (
                  <div key={it.id} className="flex gap-3 text-xs">
                    <img
                      src={it.product.images[0]}
                      alt={it.product.name}
                      className="w-14 h-18 object-cover bg-stone-200 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium text-stone-900 leading-tight">{it.product.name}</h4>
                        <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                          {it.selectedColor} · Size {it.selectedSize} · Qty {it.quantity}
                        </p>
                      </div>
                      <span className="font-mono text-stone-900 font-semibold tabular-nums">
                        {formatPrice(it.product.price * it.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Line items */}
              <div className="space-y-2 border-t border-stone-300 pt-4 text-xs font-mono text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>Atelier Privilege ({appliedPromo})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="pt-2 border-t border-stone-300 flex justify-between font-serif text-lg text-stone-950 font-normal">
                  <span>Total Amount</span>
                  <span className="font-mono font-semibold">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Security guarantees */}
              <div className="p-3.5 bg-white border border-stone-200 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-medium">
                  <ShieldCheck size={16} />
                  <span>The Atelier Guarantee</span>
                </div>
                <ul className="text-[11px] text-stone-500 space-y-1 list-disc pl-4 font-light">
                  <li>Certificate of Authenticity with unique serial seal</li>
                  <li>Insured express dispatch in signature protective hardbox</li>
                  <li>30-day complimentary exchanges and returns worldwide</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
