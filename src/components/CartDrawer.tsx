import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    discountAmount,
    discountPercent,
    discountCode,
    shippingFee,
    cartTotal,
    applyDiscountCode,
    removeDiscountCode,
    setIsCheckoutOpen,
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 50;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;
    const ok = applyDiscountCode(inputCoupon);
    if (ok) {
      setInputCoupon('');
    } else {
      setCouponError('Ungültiger Code (Tipp: WILLKOMMEN10)');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Warenkorb ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors"
              aria-label="Warenkorb schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 text-xs">
              <div className="flex items-center justify-between text-stone-600 mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-800" />
                  {amountToFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">Gratis Versand erreicht! 🎉</span>
                  ) : (
                    <span>Noch {amountToFreeShipping.toFixed(2)} € bis zum Gratis-Versand</span>
                  )}
                </span>
                <span className="tabular-nums font-semibold">{freeShippingProgress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-stone-900 h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-semibold text-stone-800 text-base mb-1">
                  Dein Warenkorb ist noch leer
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Füge handverlesene Artikel aus unserer Kollektion hinzu oder lege neue Produkte an.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
                >
                  Jetzt stöbern
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-18 h-18 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-stone-900 truncate">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        aria-label={`${item.product.title} entfernen`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-500 mt-0.5">{item.product.category}</p>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-stone-600 hover:bg-stone-100 transition-colors"
                          aria-label="Anzahl verringern"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold tabular-nums text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                          aria-label="Anzahl erhöhen"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price for this line */}
                      <span className="text-sm font-bold text-stone-900 tabular-nums">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/80 space-y-3">
              {/* Discount code section */}
              {discountCode ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Code: {discountCode} (-{discountPercent}%)</span>
                  </div>
                  <button
                    onClick={removeDiscountCode}
                    className="text-stone-500 hover:text-stone-800 font-semibold text-[11px]"
                  >
                    Entfernen
                  </button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        placeholder="Code oder PIN (z.B. 11042014)"
                        className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                    >
                      Code einlösen
                    </button>
                  </form>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-stone-500">
                    <span>Tipp: Code <button type="button" onClick={() => setInputCoupon('10pz')} className="underline font-bold text-stone-900 hover:text-stone-700">10pz</button> (-10% Rabatt)</span>
                    <button
                      type="button"
                      onClick={() => setInputCoupon('11042014')}
                      className="text-amber-800 hover:text-amber-950 font-medium underline"
                    >
                      Mitarbeiter-PIN 11042014
                    </button>
                  </div>
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
              )}

              {/* Summary calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Zwischensumme:</span>
                  <span className="tabular-nums font-medium text-stone-900">{cartSubtotal.toFixed(2)} €</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Rabatt:</span>
                    <span className="tabular-nums font-semibold">-{discountAmount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Versandkosten:</span>
                  <span className="tabular-nums font-medium text-stone-900">
                    {shippingFee === 0 ? 'Kostenlos' : `${shippingFee.toFixed(2)} €`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Gesamtsumme:</span>
                  <span className="tabular-nums text-base">{cartTotal.toFixed(2)} €</span>
                </div>
                <div className="text-[10px] text-stone-400 text-right">inkl. gesetzl. MwSt.</div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
              >
                <span>Zur Kasse gehen</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
};
