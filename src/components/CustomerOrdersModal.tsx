import React, { useState } from 'react';
import { X, Package, Clock, Truck, CheckCircle2, Search, ArrowRight, ShoppingBag, Trash2, Archive, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderStatus } from '../types';

export const CustomerOrdersModal: React.FC = () => {
  const {
    isCustomerOrdersOpen,
    setIsCustomerOrdersOpen,
    orders,
    deleteOrder,
    clearCompletedOrders,
  } = useShop();

  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [filterTab, setFilterTab] = useState<'active' | 'completed' | 'all'>('active');

  if (!isCustomerOrdersOpen) return null;

  const handleClose = () => {
    setIsCustomerOrdersOpen(false);
  };

  const activeOrders = orders.filter((o) => o.status !== 'Abgeschlossen');
  const completedOrders = orders.filter((o) => o.status === 'Abgeschlossen');

  // Base list based on selected tab: "active" means completed orders go away!
  const currentList =
    filterTab === 'active'
      ? activeOrders
      : filterTab === 'completed'
      ? completedOrders
      : orders;

  const filteredOrders = currentList.filter((o) => {
    if (!searchOrderNumber.trim()) return true;
    return o.orderNumber.toLowerCase().includes(searchOrderNumber.toLowerCase().trim());
  });

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'Neu':
        return 1;
      case 'In Zubereitung':
        return 2;
      case 'Im Versand':
        return 3;
      case 'Abgeschlossen':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-stone-900" />
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Meine Einkäufe & Bestellstatus
              </h2>
              <p className="text-xs text-stone-500">
                Verfolge deine Bestellungen in Echtzeit. Abgeschlossene Aufträge werden automatisch aus der aktiven Liste entfernt.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Filter Bar */}
        <div className="p-4 sm:px-6 bg-stone-100/60 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Segmented Filter: Active vs. Completed */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-stone-200 text-xs w-full sm:w-auto">
            <button
              onClick={() => setFilterTab('active')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                filterTab === 'active'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Laufend & Im Versand</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${filterTab === 'active' ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-700'}`}>
                {activeOrders.length}
              </span>
            </button>

            <button
              onClick={() => setFilterTab('completed')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                filterTab === 'completed'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Abgeschlossen</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full tabular-nums ${filterTab === 'completed' ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-700'}`}>
                {completedOrders.length}
              </span>
            </button>

            <button
              onClick={() => setFilterTab('all')}
              className={`flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                filterTab === 'all'
                  ? 'bg-stone-900 text-white shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Alle ({orders.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchOrderNumber}
              onChange={(e) => setSearchOrderNumber(e.target.value)}
              placeholder="Bestell-Nr. suchen..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none bg-white"
            />
          </div>
        </div>

        {/* Informational banner when completed orders went away */}
        {filterTab === 'active' && completedOrders.length > 0 && (
          <div className="bg-emerald-50/70 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{completedOrders.length} {completedOrders.length === 1 ? 'Bestellung ist' : 'Bestellungen sind'} abgeschlossen und aus der aktiven Ansicht ausgeblendet.</span>
            </span>
            <button
              onClick={() => setFilterTab('completed')}
              className="underline font-semibold hover:text-emerald-950 text-[11px]"
            >
              Im Archiv ansehen
            </button>
          </div>
        )}

        {/* Content list */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-base text-stone-800 mb-1">
                Du hast noch keine Einkäufe getätigt
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-5">
                Stöbere durch unseren Katalog, lege Produkte in den Warenkorb und bestelle mit wenigen Klicks.
              </p>
              <button
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
              >
                Jetzt im Shop einkaufen
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-stone-800 text-sm">
                {filterTab === 'active'
                  ? 'Keine offenen Einkäufe mehr – alle Bestellungen sind abgeschlossen!'
                  : 'Keine Bestellungen in dieser Kategorie vorhanden.'}
              </p>
              {filterTab === 'active' && completedOrders.length > 0 && (
                <button
                  onClick={() => setFilterTab('completed')}
                  className="mt-3 text-xs text-stone-700 underline hover:text-stone-900 font-medium"
                >
                  Zu den {completedOrders.length} abgeschlossenen Einkäufen wechseln
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => {
              const currentStep = getStepIndex(order.status);
              const isCompleted = order.status === 'Abgeschlossen';
              const orderDate = new Date(order.createdAt).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-xl border overflow-hidden shadow-sm transition-all ${
                    isCompleted ? 'border-stone-200 opacity-90' : 'border-stone-300'
                  }`}
                >
                  {/* Top order strip */}
                  <div className="p-4 bg-stone-50/70 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        #{order.orderNumber}
                      </span>
                      <span className="text-stone-400">·</span>
                      <span className="text-stone-500">{orderDate}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-stone-500">Gesamt:</span>
                        <span className="font-bold text-stone-900 tabular-nums">
                          {order.total.toFixed(2)} €
                        </span>
                      </div>

                      {/* Option to delete order from list if completed */}
                      {isCompleted && (
                        <button
                          onClick={() => {
                            if (confirm(`Bestellung #${order.orderNumber} endgültig aus den Einkäufen löschen?`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          className="p-1 text-stone-400 hover:text-rose-600 hover:bg-stone-200 rounded transition-colors"
                          title="Bestellung aus Einkäufen entfernen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Visual Status Progress Tracker */}
                  <div className="p-5 border-b border-stone-100 bg-white">
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-800 mb-2">
                        <span>Aktueller Status:</span>
                        <span
                          className={`px-2.5 py-0.5 rounded text-xs ${
                            order.status === 'Im Versand'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200 font-bold'
                              : order.status === 'In Zubereitung'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200 font-bold'
                              : order.status === 'Abgeschlossen'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold'
                              : 'bg-blue-100 text-blue-900 border border-blue-200'
                          }`}
                        >
                          {order.status === 'In Zubereitung' && '👨‍🍳 In Zubereitung / Vorbereitung'}
                          {order.status === 'Im Versand' && '🚚 Im Versand (Auf dem Weg)'}
                          {order.status === 'Abgeschlossen' && '✅ Zugestellt / Abgeschlossen'}
                          {order.status === 'Neu' && '📦 Bestellung eingegangen'}
                        </span>
                      </div>

                      {/* 4-Step Progress Line */}
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {/* Step 1: Neu */}
                        <div className="text-center">
                          <div
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                              currentStep >= 1
                                ? 'bg-stone-900 text-white'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            ✓
                          </div>
                          <span className="text-[10px] block font-medium text-stone-700">
                            Eingegangen
                          </span>
                        </div>

                        {/* Step 2: In Zubereitung */}
                        <div className="text-center">
                          <div
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                              currentStep >= 2
                                ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            {currentStep >= 2 ? (currentStep > 2 ? '✓' : '2') : '2'}
                          </div>
                          <span
                            className={`text-[10px] block font-medium ${
                              currentStep === 2 ? 'text-amber-800 font-bold' : 'text-stone-700'
                            }`}
                          >
                            In Zubereitung
                          </span>
                        </div>

                        {/* Step 3: Im Versand */}
                        <div className="text-center">
                          <div
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                              currentStep >= 3
                                ? 'bg-purple-600 text-white ring-4 ring-purple-100'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            {currentStep >= 3 ? (currentStep > 3 ? '✓' : '3') : '3'}
                          </div>
                          <span
                            className={`text-[10px] block font-medium ${
                              currentStep === 3 ? 'text-purple-800 font-bold' : 'text-stone-700'
                            }`}
                          >
                            Im Versand
                          </span>
                        </div>

                        {/* Step 4: Zugestellt */}
                        <div className="text-center">
                          <div
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                              currentStep >= 4
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-200 text-stone-500'
                            }`}
                          >
                            ✓
                          </div>
                          <span
                            className={`text-[10px] block font-medium ${
                              currentStep === 4 ? 'text-emerald-800 font-bold' : 'text-stone-700'
                            }`}
                          >
                            Zugestellt
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
                      Gekaufte Artikel ({order.items.length})
                    </span>
                    <div className="divide-y divide-stone-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-10 h-10 object-cover rounded border border-stone-200 shrink-0"
                            />
                            <div>
                              <p className="font-medium text-stone-900">{item.title}</p>
                              <p className="text-stone-400 text-[11px]">
                                {item.quantity} Stück à {item.price.toFixed(2)} €
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-stone-900 tabular-nums">
                            {(item.price * item.quantity).toFixed(2)} €
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-100 flex justify-between">
                      <span>Lieferadresse: {order.customer.fullName}, {order.customer.street}, {order.customer.city}</span>
                      <span className="capitalize">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {completedOrders.length > 0 && filterTab === 'completed' && (
              <button
                onClick={() => {
                  if (confirm('Möchtest du alle abgeschlossenen Einkäufe endgültig löschen?')) {
                    clearCompletedOrders();
                  }
                }}
                className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Alle abgeschlossenen entfernen</span>
              </button>
            )}
          </div>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-stone-900 bg-stone-200 hover:bg-stone-300 rounded-lg transition-colors"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
};
