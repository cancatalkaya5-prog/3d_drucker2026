import React from 'react';
import { CheckCircle, Printer, ShoppingBag, Store, ArrowRight, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderSuccessModal: React.FC = () => {
  const { latestOrder, setLatestOrder, setViewMode, setIsCustomerOrdersOpen } = useShop();

  if (!latestOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setLatestOrder(null);
  };

  const handleGoToSeller = () => {
    setLatestOrder(null);
    setViewMode('seller');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 p-6 sm:p-8">
        
        {/* Success Header */}
        <div className="text-center pb-6 border-b border-stone-200">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Vielen Dank für deine Bestellung!
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Bestellnummer: <span className="font-mono font-bold text-stone-800">{latestOrder.orderNumber}</span> · Bestätigung an {latestOrder.customer.email} versandt.
          </p>
        </div>

        {/* Receipt Body */}
        <div className="py-6 space-y-4 text-xs">
          
          {/* Order Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-400 block uppercase tracking-wider text-[10px]">Lieferanschrift</span>
              <p className="font-semibold text-stone-800 mt-0.5">{latestOrder.customer.fullName}</p>
              <p className="text-stone-600">{latestOrder.customer.street}</p>
              <p className="text-stone-600">{latestOrder.customer.postalCode} {latestOrder.customer.city}</p>
              <p className="text-stone-600">{latestOrder.customer.country}</p>
            </div>
            <div>
              <span className="text-stone-400 block uppercase tracking-wider text-[10px]">Zahlung & Versand</span>
              <p className="font-semibold text-stone-800 mt-0.5 capitalize">
                {latestOrder.paymentMethod === 'credit_card' && 'Kreditkarte (Visa/Mastercard)'}
                {latestOrder.paymentMethod === 'paypal' && 'PayPal Express'}
                {latestOrder.paymentMethod === 'klarna' && 'Klarna Rechnung (30 Tage)'}
                {latestOrder.paymentMethod === 'invoice' && 'Kauf auf Rechnung'}
              </p>
              <p className="text-stone-600 mt-1">Status: <span className="text-emerald-700 font-semibold">{latestOrder.status}</span></p>
              <p className="text-stone-500 text-[11px] mt-0.5">Voraussichtliche Lieferung in 2-3 Werktagen</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-semibold text-stone-900 mb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-stone-700" />
              <span>Gekaufte Artikel ({latestOrder.items.length})</span>
            </h4>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
              {latestOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-stone-900 truncate">{item.title}</p>
                      <p className="text-[11px] text-stone-500">{item.quantity} Stück à {item.price.toFixed(2)} €</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 tabular-nums">
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financials */}
          <div className="space-y-1 pt-3 border-t border-stone-200 text-stone-600">
            <div className="flex justify-between">
              <span>Zwischensumme:</span>
              <span className="tabular-nums font-medium text-stone-900">{latestOrder.subtotal.toFixed(2)} €</span>
            </div>
            {latestOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Rabatt:</span>
                <span className="tabular-nums font-semibold">-{latestOrder.discount.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Versandkosten:</span>
              <span className="tabular-nums font-medium text-stone-900">
                {latestOrder.shipping === 0 ? 'Kostenlos' : `${latestOrder.shipping.toFixed(2)} €`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Bezahlter Gesamtbetrag:</span>
              <span className="tabular-nums text-base">{latestOrder.total.toFixed(2)} €</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Beleg drucken</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLatestOrder(null);
                setIsCustomerOrdersOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Status in „Meine Einkäufe“ verfolgen</span>
            </button>

            <button
              onClick={handleClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Weiter einkaufen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
