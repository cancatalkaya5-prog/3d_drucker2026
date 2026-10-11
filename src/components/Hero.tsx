import React from 'react';
import { ArrowDown, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { heroShopImg } from '../data/initialProducts';
import { useShop } from '../context/ShopContext';

export const Hero: React.FC = () => {
  const { setViewMode } = useShop();

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-stone-100/60 border-b border-stone-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Text Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Unboxed subtle kicker metadata */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-4">
              <span>Boutique & Atelier</span>
              <span aria-hidden="true">·</span>
              <span>Kollektion 2026</span>
              <span aria-hidden="true">·</span>
              <span>Direkt vom Hersteller</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15] text-balance mb-5">
              Zeitloses Handwerk & minimalistisches Design.
            </h1>

            <p className="text-base text-stone-600 leading-relaxed max-w-xl mb-8">
              Entdecke langlebige Lieblingsstücke für deinen Alltag – von handgenähten Lederwaren
              über nachhaltige Textilien bis hin zu audiophiler Akustik. Bestelle bequem online
              oder verwalte eigene Produkte im integrierten Händlerbereich.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={scrollToCatalog}
                className="px-5 py-3 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2 group whitespace-nowrap"
              >
                <span>Produkte entdecken</span>
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={() => setViewMode('seller')}
                className="px-5 py-3 text-sm font-medium text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Eigene Artikel einstellen</span>
              </button>
            </div>

            {/* Trust points adjacent */}
            <div className="mt-10 pt-6 border-t border-stone-200 grid grid-cols-3 gap-4 text-stone-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-stone-700 shrink-0" />
                <span className="text-xs font-medium">Gratis Versand ab 50€</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0" />
                <span className="text-xs font-medium">Geprüfte Qualität</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-stone-700 shrink-0" />
                <span className="text-xs font-medium">30 Tage Rückgabe</span>
              </div>
            </div>
          </div>

          {/* Image Showcase Column */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[460px] rounded-2xl overflow-hidden shadow-md border border-stone-200/80 bg-stone-200">
              <img
                src={heroShopImg}
                alt="Artisan & Co. Atelier & Storefront"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-white/50 text-stone-800 text-xs flex items-center justify-between shadow-sm">
                <div>
                  <span className="font-semibold block text-stone-900">Kuratiertes Sortiment</span>
                  <span className="text-stone-500">Alle Artikel sofort lieferbar</span>
                </div>
                <button
                  onClick={scrollToCatalog}
                  className="px-3 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-md hover:bg-stone-800 transition-colors"
                >
                  Jetzt shoppen
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
