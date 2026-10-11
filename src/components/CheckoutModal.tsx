import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CustomerInfo, PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    discountCode,
    shippingFee,
    cartTotal,
    createOrder,
  } = useShop();

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: 'Max Mustermann',
    email: 'max@beispiel.de',
    street: 'Kaiserstraße 42',
    postalCode: '10115',
    city: 'Berlin',
    country: 'Deutschland',
    phone: '+49 170 1234567',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isCheckoutOpen || cart.length === 0) return null;

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!customer.fullName.trim()) errors.fullName = 'Bitte gib deinen Namen ein.';
    if (!customer.email.trim() || !customer.email.includes('@')) errors.email = 'Gültige E-Mail erforderlich.';
    if (!customer.street.trim()) errors.street = 'Straße und Hausnummer erforderlich.';
    if (!customer.postalCode.trim()) errors.postalCode = 'PLZ erforderlich.';
    if (!customer.city.trim()) errors.city = 'Stadt erforderlich.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      createOrder(customer, paymentMethod);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-stone-700" />
            <span className="font-serif font-bold text-lg text-stone-900">Sichere Kasse</span>
            <span className="text-xs text-stone-400">· SSL 256-Bit Verschlüsselt</span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors"
            aria-label="Kasse schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
          
          {/* Main Checkout Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-mono flex items-center justify-center">1</span>
                  <span>Lieferadresse & Kontaktdaten</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-medium mb-1">Vollständiger Name *</label>
                    <input
                      type="text"
                      required
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="Vor- und Nachname"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none"
                    />
                    {formErrors.fullName && <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-medium mb-1">E-Mail-Adresse (für Bestellbestätigung) *</label>
                    <input
                      type="email"
                      required
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="deine.email@beispiel.de"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none"
                    />
                    {formErrors.email && <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-medium mb-1">Straße & Hausnummer *</label>
                    <input
                      type="text"
                      required
                      value={customer.street}
                      onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                      placeholder="z.B. Musterstraße 12"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none"
                    />
                    {formErrors.street && <p className="text-[11px] text-rose-600 mt-1">{formErrors.street}</p>}
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Postleitzahl *</label>
                    <input
                      type="text"
                      required
                      value={customer.postalCode}
                      onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                      placeholder="10115"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none"
                    />
                    {formErrors.postalCode && <p className="text-[11px] text-rose-600 mt-1">{formErrors.postalCode}</p>}
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Stadt *</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="Berlin"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none"
                    />
                    {formErrors.city && <p className="text-[11px] text-rose-600 mt-1">{formErrors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Land</label>
                    <select
                      value={customer.country}
                      onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none bg-white"
                    >
                      <option value="Deutschland">Deutschland</option>
                      <option value="Österreich">Österreich</option>
                      <option value="Schweiz">Schweiz</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Telefonnummer (optional)</label>
                    <input
                      type="tel"
                      value={customer.phone || ''}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="+49 ..."
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-4 border-t border-stone-200">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-mono flex items-center justify-center">2</span>
                  <span>Zahlungsmethode wählen</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="text-stone-900"
                    />
                    <div className="flex-1">
                      <span className="font-semibold block text-stone-900">Kreditkarte</span>
                      <span className="text-[11px] text-stone-500">Visa, Mastercard, Amex</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'paypal'
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="text-stone-900"
                    />
                    <div className="flex-1">
                      <span className="font-semibold block text-stone-900">PayPal Express</span>
                      <span className="text-[11px] text-stone-500">Käuferschutz inklusive</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'klarna'
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'klarna'}
                      onChange={() => setPaymentMethod('klarna')}
                      className="text-stone-900"
                    />
                    <div className="flex-1">
                      <span className="font-semibold block text-stone-900">Klarna Rechnung</span>
                      <span className="text-[11px] text-stone-500">Erst prüfen, in 30 Tagen zahlen</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'invoice'
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'invoice'}
                      onChange={() => setPaymentMethod('invoice')}
                      className="text-stone-900"
                    />
                    <div className="flex-1">
                      <span className="font-semibold block text-stone-900">Kauf auf Rechnung</span>
                      <span className="text-[11px] text-stone-500">Zahlungsziel 14 Tage</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Zurück zum Shop</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Bestellung wird vorbereitet...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Jetzt kostenpflichtig bestellen ({cartTotal.toFixed(2)} €)</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Order Summary Column (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-stone-50 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mb-4">
                Bestellübersicht ({cart.reduce((s, i) => s + i.quantity, 0)} Artikel)
              </h3>

              <div className="max-h-60 overflow-y-auto divide-y divide-stone-200 pr-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="w-12 h-12 rounded object-cover border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {item.quantity} × {item.product.price.toFixed(2)} €
                      </p>
                    </div>
                    <span className="text-xs font-bold text-stone-900 tabular-nums">
                      {(item.product.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="mt-6 pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Zwischensumme:</span>
                  <span className="tabular-nums font-medium text-stone-900">{cartSubtotal.toFixed(2)} €</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Rabatt ({discountCode}):</span>
                    <span className="tabular-nums font-semibold">-{discountAmount.toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standardversand:</span>
                  <span className="tabular-nums font-medium text-stone-900">
                    {shippingFee === 0 ? 'Kostenlos' : `${shippingFee.toFixed(2)} €`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                  <span>Gesamtbetrag:</span>
                  <span className="tabular-nums text-lg">{cartTotal.toFixed(2)} €</span>
                </div>
                <div className="text-[11px] text-stone-400">inkl. MwSt. & umweltfreundlicher Verpackung</div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-200 text-[11px] text-stone-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Käuferschutz & Geld-zurück-Garantie bei Artisan & Co.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
