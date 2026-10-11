import React, { useState } from 'react';
import {
  Plus,
  Package,
  TrendingUp,
  ShoppingBag,
  Edit2,
  Trash2,
  Search,
  RotateCcw,
  ExternalLink,
  PlusCircle,
  MinusCircle,
  FileDown,
  Layers,
  Lock,
  KeyRound,
  ShieldCheck,
  LogOut,
  ArrowRight,
  AlertTriangle,
  X,
  Headphones,
  MessageSquare,
  Send,
  Bot,
  User,
  CheckCircle2,
} from 'lucide-react';
import { useShop, STAFF_PIN } from '../../context/ShopContext';
import { Product } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { OrdersList } from './OrdersList';

export const SellerDashboard: React.FC = () => {
  const {
    products,
    deleteProduct,
    updateProduct,
    orders,
    resetToDefaults,
    setViewMode,
    isStaffAuthenticated,
    setIsPinModalOpen,
    verifyStaffPin,
    logoutStaff,
    securityAlerts,
    clearSecurityAlerts,
    dismissSecurityAlert,
    chatSession,
    sendStaffMessage,
    resetChat,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'support' | 'settings'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [staffReplyText, setStaffReplyText] = useState('');

  // Quick inline PIN state for the lockscreen
  const [inlinePin, setInlinePin] = useState('');
  const [inlineError, setInlineError] = useState('');

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalProductsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.quantity, 0),
    0
  );
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  // Filter products
  const categories = ['Alle', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleAdjustStock = (p: Product, delta: number) => {
    const newStock = Math.max(0, p.stock + delta);
    updateProduct(p.id, { stock: newStock });
  };

  const handleExportJSON = () => {
    const data = JSON.stringify({ products, orders }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shop-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleInlinePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError('');
    if (verifyStaffPin(inlinePin)) {
      setInlinePin('');
    } else {
      setInlineError('Falscher PIN! Bitte Mitarbeiter-PIN 11042014 eingeben.');
    }
  };

  // If NOT authenticated as staff, show employee PIN lockscreen!
  if (!isStaffAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-800">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
              <span>Zugriff geschützt</span>
              <span aria-hidden="true">·</span>
              <span>Mitarbeiter erforderlich</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">
              Mitarbeiter-Bereich gesperrt
            </h2>
            <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Dieser Bereich ist für Mitarbeiter reserviert. Klicke auf <strong>„Code einlösen“</strong> und gib den PIN <span className="font-mono font-bold text-stone-800">11042014</span> ein, um Artikel zu verwalten und Bestellungen einzusehen.
            </p>
          </div>

          {/* Quick inline PIN entry */}
          <form onSubmit={handleInlinePinSubmit} className="space-y-3 pt-2 max-w-xs mx-auto">
            <div className="flex gap-2">
              <input
                type="password"
                inputMode="numeric"
                value={inlinePin}
                onChange={(e) => {
                  setInlineError('');
                  setInlinePin(e.target.value);
                }}
                placeholder="PIN 11042014"
                className="w-full text-center text-sm font-mono tracking-widest py-2.5 px-3 rounded-xl border border-stone-300 focus:ring-1 focus:ring-stone-900 outline-none bg-stone-50"
              />
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors whitespace-nowrap shadow-sm"
              >
                Freischalten
              </button>
            </div>

            {inlineError && (
              <p className="text-xs text-rose-600 font-medium">{inlineError}</p>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsPinModalOpen(true)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-amber-700" />
                <span>Auf „Code einlösen“ klicken</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('shop')}
                className="text-xs text-stone-500 hover:text-stone-800 py-1"
              >
                Zurück zum Shop (Kunden-Ansicht)
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Top Banner / Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 mb-8">
        <div>
          {/* Unboxed breadcrumb metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Mitarbeiter verifiziert (PIN {STAFF_PIN})
            </span>
            <span aria-hidden="true">·</span>
            <span>Inventar & Verkaufszentrale</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Shop-Verwaltung & Meine Artikel
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('shop')}
            className="px-4 py-2.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <span>Kunden-Ansicht öffnen</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Neuen Artikel einstellen</span>
          </button>

          <button
            onClick={logoutStaff}
            className="p-2.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            title="Mitarbeiter-Bereich sperren"
            aria-label="Sperren"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Alert: Unauthorized PIN attempts logged */}
      {securityAlerts.length > 0 && (
        <div className="mb-8 bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 sm:p-6 shadow-sm animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-rose-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-rose-950 flex items-center gap-2 flex-wrap">
                  <span>🚨 Alarm: Der Typ auf dem PC hat versucht reinzukommen!</span>
                  <span className="bg-rose-200 text-rose-900 text-[11px] px-2 py-0.5 rounded-full font-mono font-bold">
                    {securityAlerts.length} {securityAlerts.length === 1 ? 'Einbruchsversuch' : 'Einbruchsversuche'}
                  </span>
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  Jemand hat versucht, ohne gültigen Mitarbeiter-PIN Zugriff auf deine Artikel und Bestände zu erhalten.
                </p>
              </div>
            </div>

            <button
              onClick={clearSecurityAlerts}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-900 bg-rose-200 hover:bg-rose-300 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              Alle Warnungen löschen
            </button>
          </div>

          {/* List of attempts with timestamp and failed PIN */}
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
            {securityAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white/90 border border-rose-200 p-2.5 rounded-xl flex items-center justify-between text-xs gap-3"
              >
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <span className="font-mono text-stone-500 text-[11px] font-semibold">
                    {new Date(alert.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} Uhr
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-rose-900 font-bold">
                    {alert.message}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-700 font-mono text-[11px]">
                    Falscher Code: <span className="bg-stone-100 px-1.5 py-0.5 rounded font-bold text-rose-800">„{alert.enteredPin}“</span>
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-stone-500 text-[11px]">{alert.deviceInfo}</span>
                </div>

                <button
                  onClick={() => dismissSecurityAlert(alert.id)}
                  className="text-stone-400 hover:text-rose-700 p-1 shrink-0"
                  title="Diesen Eintrag entfernen"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gesamtumsatz</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums">
            {totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Aus {orders.length} Bestellungen</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Verkaufte Stk.</span>
            <ShoppingBag className="w-4 h-4 text-stone-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums">
            {totalProductsSold}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Über den Shop bestellt</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Aktive Artikel</span>
            <Package className="w-4 h-4 text-stone-700" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums">
            {products.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Im Online-Katalog gelistet</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Lager-Warnungen</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 tabular-nums">
            {outOfStockCount > 0 ? (
              <span className="text-rose-600">{outOfStockCount} ausverkauft</span>
            ) : (
              <span className="text-emerald-700">Alles vorrätig</span>
            )}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Bestandsstatus im Blick</div>
        </div>
      </div>

      {/* Live Chat Human Handoff Alert Banner */}
      {chatSession.waitingForHuman && (
        <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                <span>🔔 Live-Chat Anfrage: Ein Kunde möchte mit dir sprechen!</span>
                <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">Wartet auf Antwort</span>
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Der Kunde hat im Chat geschrieben, dass er persönlich mit dir verbunden werden möchte.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('support')}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-sm whitespace-nowrap"
          >
            Jetzt Chat übernehmen & antworten
          </button>
        </div>
      )}

      {/* Segmented Tab Bar */}
      <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl mb-6 w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'products'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Meine Artikel ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'orders'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Bestellungen & Verkäufe ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'support'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Live-Support & Chat</span>
          {chatSession.waitingForHuman && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'settings'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Verwaltung & Export
        </button>
      </div>

      {/* Tab 1: Products Inventory */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          
          {/* Controls: Search, Filter, Add */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Artikel nach Name, SKU oder Text suchen..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 outline-none font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    Kategorie: {c}
                  </option>
                ))}
              </select>

              <button
                onClick={handleCreateNew}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Artikel hinzufügen</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Artikel</th>
                    <th className="py-3 px-4">Kategorie</th>
                    <th className="py-3 px-4">Preis</th>
                    <th className="py-3 px-4">Lagerbestand</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-400">
                        Keine Artikel für diesen Suchbegriff gefunden.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const isOut = p.stock <= 0;
                      return (
                        <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <img
                                src={p.imageUrl}
                                alt={p.title}
                                className="w-12 h-12 object-cover rounded-lg border border-stone-200 shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-stone-900 block">{p.title}</span>
                                <span className="text-[11px] font-mono text-stone-400">SKU: {p.sku}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-stone-600 font-medium">
                            {p.category}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-stone-900 tabular-nums">
                              {p.price.toFixed(2)} €
                            </span>
                            {p.originalPrice && (
                              <span className="block text-[11px] text-stone-400 line-through tabular-nums">
                                UVP: {p.originalPrice.toFixed(2)} €
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAdjustStock(p, -1)}
                                disabled={p.stock <= 0}
                                className="text-stone-400 hover:text-stone-800 disabled:opacity-30"
                                title="Bestand um 1 verringern"
                              >
                                <MinusCircle className="w-4 h-4" />
                              </button>
                              <span className="font-semibold tabular-nums min-w-[24px] text-center">
                                {p.stock}
                              </span>
                              <button
                                onClick={() => handleAdjustStock(p, 1)}
                                className="text-stone-400 hover:text-stone-800"
                                title="Bestand um 1 erhöhen"
                              >
                                <PlusCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {isOut ? (
                              <span className="text-rose-700 font-semibold text-[11px]">Ausverkauft</span>
                            ) : p.stock <= 3 ? (
                              <span className="text-amber-700 font-semibold text-[11px]">Knapp ({p.stock})</span>
                            ) : (
                              <span className="text-emerald-700 font-semibold text-[11px]">Aktiv</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEdit(p)}
                                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                                title="Bearbeiten"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Möchtest du "${p.title}" wirklich löschen?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Löschen"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders List */}
      {activeTab === 'orders' && <OrdersList />}

      {/* Tab 3: Live-Support Desk */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col max-w-3xl">
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                  <span>Live-Support Zentrale</span>
                  {chatSession.waitingForHuman && (
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-300">
                      Kunde wartet auf dich
                    </span>
                  )}
                  {chatSession.isHumanConnected && (
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                      Du bist live verbunden
                    </span>
                  )}
                </h3>
                <p className="text-xs text-stone-500">
                  {chatSession.isHumanConnected
                    ? 'Du chattest jetzt direkt mit dem Kunden. Jede Nachricht kommt sofort bei ihm an.'
                    : chatSession.waitingForHuman
                    ? 'Der Kunde hat darum gebeten, mit einem echten Mitarbeiter zu sprechen! Antworte hier.'
                    : 'Der AI-Bot beantwortet Standardfragen. Du kannst dich jederzeit einklinken.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetChat}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-200/80 hover:bg-stone-300 rounded-lg transition-colors flex items-center gap-1.5"
                title="Chatverlauf leeren"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chat zurücksetzen</span>
              </button>
            </div>
          </div>

          {/* Transcript */}
          <div className="p-5 max-h-96 overflow-y-auto space-y-3.5 bg-stone-50/50 text-xs">
            {chatSession.messages.map((msg) => {
              const isCust = msg.sender === 'customer';
              const isStaff = msg.sender === 'human_staff';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-stone-400 mb-0.5 px-1 font-medium">
                    {isStaff ? 'Du (Mitarbeiter)' : isCust ? 'Kunde' : 'AI-Bot'} ·{' '}
                    {new Date(msg.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed shadow-sm ${
                      isStaff
                        ? 'bg-stone-900 text-white rounded-br-none font-medium'
                        : isCust
                        ? 'bg-amber-100 text-stone-900 border border-amber-300 rounded-bl-none font-semibold'
                        : 'bg-white text-stone-700 border border-stone-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Canned Quick Replies */}
          <div className="px-4 py-2.5 bg-stone-100 border-t border-stone-200 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-stone-500 whitespace-nowrap font-semibold">Schnellantworten:</span>
            <button
              onClick={() => sendStaffMessage('Hallo! Ich bin jetzt persönlich für dich da. Wie kann ich dir helfen?')}
              className="px-2.5 py-1 bg-white hover:bg-stone-200 rounded-md border border-stone-200 text-stone-800 whitespace-nowrap transition-colors"
            >
              „Hallo! Ich bin jetzt persönlich da.“
            </button>
            <button
              onClick={() => sendStaffMessage('Hier ist dein Rabattcode "10pz" für 10% Rabatt auf deine Bestellung!')}
              className="px-2.5 py-1 bg-white hover:bg-stone-200 rounded-md border border-stone-200 text-stone-800 whitespace-nowrap transition-colors"
            >
              „Code 10pz senden (-10%)“
            </button>
            <button
              onClick={() => sendStaffMessage('Deine Bestellung ist bereits in Zubereitung und wird zeitnah versandt!')}
              className="px-2.5 py-1 bg-white hover:bg-stone-200 rounded-md border border-stone-200 text-stone-800 whitespace-nowrap transition-colors"
            >
              „Bestellung in Zubereitung“
            </button>
          </div>

          {/* Staff Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!staffReplyText.trim()) return;
              sendStaffMessage(staffReplyText.trim());
              setStaffReplyText('');
            }}
            className="p-4 bg-white border-t border-stone-200 flex gap-2"
          >
            <input
              type="text"
              value={staffReplyText}
              onChange={(e) => setStaffReplyText(e.target.value)}
              placeholder="Antworte dem Kunden direkt als echter Mitarbeiter..."
              className="flex-1 text-xs px-3 py-2.5 border border-stone-300 rounded-xl focus:ring-1 focus:ring-stone-900 outline-none bg-stone-50"
            />
            <button
              type="submit"
              disabled={!staffReplyText.trim()}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Senden</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Settings & Data */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-lg">
              Daten exportieren
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Lade all deine aktuellen Produkte, Bestände und Bestellungen als strukturierte JSON-Datei herunter, um deine Daten zu sichern.
            </p>
            <button
              onClick={handleExportJSON}
              className="px-4 py-2.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              <span>Shop-Daten herunterladen (.json)</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
            <h3 className="font-serif font-bold text-stone-900 text-lg">
              Demo-Daten zurücksetzen
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Setzt den Shop auf die ursprünglichen kuratierten Artikel (Bio-Hoodie, Ledertasche, ANC Kopfhörer, Keramiktasse) zurück und leert den Warenkorb sowie die Testbestellungen.
            </p>
            <button
              onClick={() => {
                if (confirm('Möchtest du wirklich alle Artikel und Bestellungen auf die Standardwerte zurücksetzen?')) {
                  resetToDefaults();
                }
              }}
              className="px-4 py-2.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-2 border border-rose-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Katalog & Bestellungen zurücksetzen</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal for Creating / Editing Products */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
      />

    </div>
  );
};
