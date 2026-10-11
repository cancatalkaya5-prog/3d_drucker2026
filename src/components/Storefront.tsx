import React, { useState } from 'react';
import { Search, SlidersHorizontal, Sparkles, Shield, HeartHandshake, Leaf } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const Storefront: React.FC = () => {
  const { products, setViewMode } = useShop();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Derive categories from current products
  const categories = ['Alle', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase()) ||
      (product.tags && product.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
    const matchesCategory = selectedCategory === 'Alle' || product.category === selectedCategory;
    const matchesStock = !onlyInStock || product.stock > 0;
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // Default featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const featuredItems = products.filter((p) => p.isFeatured);

  return (
    <div className="space-y-16">
      
      {/* Featured Bestsellers Section (if any featured products exist) */}
      {featuredItems.length > 0 && (
        <section id="featured-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
                <span>Ausgewählt</span>
                <span aria-hidden="true">·</span>
                <span>Höchste Kundenzufriedenheit</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Kuratierte Bestseller
              </h2>
            </div>
            <p className="text-xs text-stone-500 max-w-md">
              Unsere gefragtesten Manufaktur-Klassiker – gefertigt aus edlen Naturmaterialien mit Fokus auf höchste Langlebigkeit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.slice(0, 3).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {/* Main Catalog & Filter Section */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
              <span>Sortiment</span>
              <span aria-hidden="true">·</span>
              <span>{products.length} Artikel verfügbar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Der Gesamtkatalog
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Artikel oder Stichwort suchen..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none bg-white"
            />
          </div>
        </div>

        {/* Filter Controls Row: Category Tabs + Sort + Stock toggle */}
        <div className="py-5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Functional Category Filter Tabs (Zero-Pill discipline: clean segmented control) */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Stock Settings */}
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-stone-600 select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
              />
              <span>Nur vorrätig</span>
            </label>

            <div className="flex items-center gap-1.5 text-stone-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white text-stone-800 outline-none font-medium text-xs"
              >
                <option value="featured">Empfohlen</option>
                <option value="price-asc">Preis: Aufsteigend</option>
                <option value="price-desc">Preis: Absteigend</option>
                <option value="newest">Neueste zuerst</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 my-8">
            <p className="font-serif font-bold text-lg text-stone-800 mb-1">
              Keine Artikel für deine Auswahl gefunden
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              Passe deine Filterkriterien an oder lege im Verkäufer-Bereich passende neue Produkte an.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('Alle');
                setOnlyInStock(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Quick add product banner for shop owner */}
        <div className="mt-12 p-6 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Du möchtest eigene Artikel in diesem Shop verkaufen?
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Im Verkäufer-Dashboard kannst du beliebig viele Produkte mit Bild, Preisen und Lagerbestand anlegen.
            </p>
          </div>
          <button
            onClick={() => setViewMode('seller')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            Artikel jetzt verwalten & hinzufügen
          </button>
        </div>

      </section>

      {/* Craftsmanship / Story Section */}
      <section id="story-section" className="bg-white border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              <span>Philosophie</span>
              <span aria-hidden="true">·</span>
              <span>Qualitätsversprechen</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Handwerkliche Hingabe statt schneller Massenware.
            </h2>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Jedes Produkt in unserem Katalog wird nach strengen Kriterien hinsichtlich Materialgüte,
              sozialer Verantwortung und zeitlosem Mehrwert selektiert.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-900">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-stone-900 text-base">01. Reine Naturmaterialien</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Vegetabil gegerbtes Leder, pestizidfreie Bio-Baumwolle und langlebige Steinzeug-Massen garantieren Freude über viele Jahre hinweg.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-900">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-stone-900 text-base">02. Geprüfte Haltbarkeit</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Reparierbare Konstruktionen, verstärkte Nähte und hochwertige Komponenten verhindern unnötigen Elektroschrott und Wegwerfkultur.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-900">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-stone-900 text-base">03. Transparente Preisgestaltung</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Keine künstlichen Aufschläge durch Zwischenhändler. Echte Qualität zu fairen Preisen direkt vom Erzeuger zum Kunden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-stone-200 text-xs text-stone-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-stone-900 text-base">Artisan & Co.</span>
            <span>·</span>
            <span>Online-Shop & Atelier Studio</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Gratis Versand ab 50€</span>
            <span>·</span>
            <span>30 Tage Rückgaberecht</span>
            <span>·</span>
            <span>Sichere Bezahlung</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
