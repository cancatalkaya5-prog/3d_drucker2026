import React, { useState } from 'react';
import { Package, Clock, CheckCircle2, ChevronRight, Truck, Mail, MapPin, Trash2, Check, Filter } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { OrderStatus } from '../../types';

export const OrdersList: React.FC = () => {
  const { orders, updateOrderStatus, setViewMode, deleteOrder, clearCompletedOrders } = useShop();

  const [filterMode, setFilterMode] = useState<'open' | 'completed' | 'all'>('open');

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
        <Package className="w-12 h-12 mx-auto text-stone-300 mb-3" />
        <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">
          Noch keine Bestellungen eingegangen
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
          Sobald Kunden in deinem Shop etwas kaufen, erscheinen hier die Bestellungen mit Adresse, Zahlungsart und Status.
        </p>
        <button
          onClick={() => setViewMode('shop')}
          className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
        >
          Zum Shop & Testkauf durchführen
        </button>
      </div>
    );
  }

  const openOrders = orders.filter((o) => o.status !== 'Abgeschlossen');
  const completedOrders = orders.filter((o) => o.status === 'Abgeschlossen');

  const displayedOrders =
    filterMode === 'open'
      ? openOrders
      : filterMode === 'completed'
      ? completedOrders
      : orders;

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Neu':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'In Zubereitung':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Im Versand':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Abgeschlossen':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-stone-50 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Control bar: Open vs. Completed Orders */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
          <button
            onClick={() => setFilterMode('open')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              filterMode === 'open'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Offene Aufträge ({openOrders.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('completed')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1 ${
              filterMode === 'completed'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Abgeschlossen ({completedOrders.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
              filterMode === 'all'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Alle ({orders.length})
          </button>
        </div>

        {/* Clear completed button */}
        {completedOrders.length > 0 && filterMode === 'completed' && (
          <button
            onClick={() => {
              if (confirm('Möchtest du alle abgeschlossenen Bestellungen endgültig löschen?')) {
                clearCompletedOrders();
              }
            }}
            className="text-xs text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Alle {completedOrders.length} abgeschlossenen entfernen</span>
          </button>
        )}
      </div>

      {/* Info notice in open tab */}
      {filterMode === 'open' && (
        <div className="text-[11px] text-stone-500 px-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-stone-400" />
          <span>Sobald eine Bestellung auf „Abgeschlossen“ gesetzt wird, verschwindet sie automatisch aus den offenen Aufträgen.</span>
        </div>
      )}

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-10 text-center text-stone-500">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <p className="font-semibold text-stone-800 text-sm">
            {filterMode === 'open'
              ? 'Keine offenen Aufträge – alles ist erledigt oder abgeschlossen!'
              : 'Keine abgeschlossenen Bestellungen vorhanden.'}
          </p>
          {filterMode === 'open' && completedOrders.length > 0 && (
            <button
              onClick={() => setFilterMode('completed')}
              className="mt-2 text-xs text-stone-700 underline font-medium"
            >
              Zu den {completedOrders.length} abgeschlossenen Bestellungen wechseln
            </button>
          )}
        </div>
      ) : (
        displayedOrders.map((order) => {
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
                order.status === 'Abgeschlossen' ? 'border-stone-200 opacity-90' : 'border-stone-300'
              }`}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs text-stone-400">· {orderDate}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Status change select & delete option */}
                <div className="flex items-center gap-2 text-xs">
                  <label className="text-stone-500 font-medium">Status ändern:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="px-2.5 py-1 text-xs border border-stone-300 rounded-lg bg-white text-stone-800 font-medium focus:ring-1 focus:ring-stone-900 outline-none"
                  >
                    <option value="Neu">Neu</option>
                    <option value="In Zubereitung">In Zubereitung</option>
                    <option value="Im Versand">Im Versand</option>
                    <option value="Abgeschlossen">Abgeschlossen (geht weg)</option>
                  </select>

                  <button
                    onClick={() => {
                      if (confirm(`Bestellung #${order.orderNumber} löschen?`)) {
                        deleteOrder(order.id);
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
                    title="Bestellung entfernen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                
                {/* Customer Column */}
                <div className="md:col-span-5 space-y-2">
                  <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider text-[11px] text-stone-400">
                    Kundendaten
                  </h4>
                  <p className="font-medium text-stone-900 text-sm">{order.customer.fullName}</p>
                  <div className="text-stone-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <a href={`mailto:${order.customer.email}`} className="hover:underline">
                      {order.customer.email}
                    </a>
                  </div>
                  <div className="text-stone-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <div>
                      <p>{order.customer.street}</p>
                      <p>{order.customer.postalCode} {order.customer.city}, {order.customer.country}</p>
                    </div>
                  </div>
                  {order.customer.phone && (
                    <p className="text-stone-500 text-[11px]">Tel: {order.customer.phone}</p>
                  )}
                </div>

                {/* Items Column */}
                <div className="md:col-span-7 space-y-3">
                  <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider text-[11px] text-stone-400">
                    Bestellte Positionen
                  </h4>
                  <div className="divide-y divide-stone-100 bg-stone-50/50 rounded-lg p-2 border border-stone-150">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between gap-3 first:pt-1 last:pb-1">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-9 h-9 object-cover rounded border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-stone-900 truncate">{item.title}</p>
                            <p className="text-stone-400 text-[11px]">Menge: {item.quantity} Stk.</p>
                          </div>
                        </div>
                        <span className="font-bold text-stone-900 tabular-nums">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total Line */}
                  <div className="flex justify-between items-center pt-2 text-stone-700">
                    <span className="text-[11px] text-stone-400">
                      Zahlungsmethode: <span className="text-stone-800 capitalize font-medium">{order.paymentMethod}</span>
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-stone-500 mr-2">Gesamtsumme:</span>
                      <span className="text-base font-bold text-stone-900 tabular-nums">
                        {order.total.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
