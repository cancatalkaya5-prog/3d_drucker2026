import React from 'react';
import { ShoppingBag, Store, PlusCircle, KeyRound, LogOut, CheckCircle2, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface NavbarProps {
  onOpenNewProductModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewProductModal }) => {
  const {
    cart,
    setIsCartOpen,
    viewMode,
    setViewMode,
    isStaffAuthenticated,
    setIsPinModalOpen,
    logoutStaff,
    orders,
    setIsCustomerOrdersOpen,
    setIsSupportChatOpen,
  } = useShop();

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSellerAccess = () => {
    if (isStaffAuthenticated) {
      setViewMode('seller');
    } else {
      setIsPinModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setViewMode('shop')}
              className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-stone-900 hover:text-stone-700 transition-colors text-left"
            >
              Artisan & Co.
            </button>
            <span className="hidden sm:inline-block text-xs font-medium text-stone-400 border border-stone-200 rounded px-1.5 py-0.5">
              Online Shop
            </span>
          </div>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={() => {
                setViewMode('shop');
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'shop' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              Katalog
            </button>
            <button
              onClick={() => {
                setViewMode('shop');
                const el = document.getElementById('featured-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Bestseller
            </button>
            <button
              onClick={() => {
                setViewMode('shop');
                const el = document.getElementById('story-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Manufaktur & Story
            </button>
            <button
              onClick={() => setIsCustomerOrdersOpen(true)}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>Meine Einkäufe</span>
              {orders.length > 0 && (
                <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded-full font-mono font-semibold">
                  {orders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsSupportChatOpen(true)}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-stone-600"
            >
              <span>Support & Chat</span>
            </button>
            <button
              onClick={handleSellerAccess}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                viewMode === 'seller' ? 'text-stone-950 font-bold' : 'text-stone-600'
              }`}
            >
              <span>Artikel verwalten</span>
              {!isStaffAuthenticated && (
                <span className="text-[10px] text-amber-700 font-normal border border-amber-300 bg-amber-50 rounded px-1">PIN</span>
              )}
            </button>
          </nav>

          {/* Zone 3: Primary action cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Meine Einkäufe button on mobile */}
            <button
              onClick={() => setIsCustomerOrdersOpen(true)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors relative"
              title="Meine Einkäufe & Sendungsverfolgung"
              aria-label="Meine Einkäufe"
            >
              <Package className="w-4 h-4" />
              {orders.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>

            {/* "Code einlösen / Mitarbeiter PIN" button */}
            {!isStaffAuthenticated ? (
              <button
                onClick={() => setIsPinModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0"
                title="Mitarbeiter-PIN 11042014 eingeben"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>Code einlösen</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewMode(viewMode === 'seller' ? 'shop' : 'seller')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Mitarbeiter aktiv</span>
                  <span className="sm:hidden">Mitarbeiter</span>
                </button>
                <button
                  onClick={logoutStaff}
                  className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  title="Mitarbeiter abmelden"
                  aria-label="Abmelden"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick new article button if in seller mode */}
            {viewMode === 'seller' && isStaffAuthenticated && onOpenNewProductModal && (
              <button
                onClick={onOpenNewProductModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Artikel anlegen</span>
              </button>
            )}

            {/* Shopping Bag CTA */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Warenkorb öffnen (${totalItemsCount} Artikel)`}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Warenkorb</span>
              <span className="tabular-nums font-semibold bg-white text-stone-900 text-[11px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {totalItemsCount}
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
