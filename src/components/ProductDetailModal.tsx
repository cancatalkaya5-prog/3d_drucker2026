import React, { useState } from 'react';
import { X, ShoppingBag, Check, ShieldCheck, Truck, ArrowRight, Minus, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCheckoutOpen } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!selectedProduct) return null;

  const isOutOfStock = selectedProduct.stock <= 0;
  const hasDiscount = selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(selectedProduct, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-900 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Media Column */}
          <div className="relative bg-stone-100 aspect-square md:aspect-auto md:h-full overflow-hidden flex items-center justify-center">
            {!imgError && selectedProduct.imageUrl ? (
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="p-8 text-center text-stone-400">
                <span className="text-4xl block mb-2">📦</span>
                <span className="text-sm">{selectedProduct.title}</span>
              </div>
            )}

            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-stone-900 text-white text-xs font-semibold px-2.5 py-1 rounded">
                Sale -{Math.round((1 - selectedProduct.price / selectedProduct.originalPrice!) * 100)}%
              </span>
            )}
          </div>

          {/* Product Information Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & SKU metadata */}
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                <span className="uppercase font-semibold tracking-wider">{selectedProduct.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-stone-400">SKU: {selectedProduct.sku}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-snug">
                {selectedProduct.title}
              </h2>

              {/* Price display */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-stone-900 tabular-nums">
                  {selectedProduct.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </span>
                {hasDiscount && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {selectedProduct.originalPrice?.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                  </span>
                )}
                <span className="text-xs text-stone-500 font-normal">inkl. MwSt.</span>
              </div>

              {/* Stock status */}
              <div className="mt-3 text-xs">
                {isOutOfStock ? (
                  <span className="font-semibold text-rose-600">Zurzeit vergriffen</span>
                ) : (
                  <span className="font-medium text-emerald-700">
                    Auf Lager ({selectedProduct.stock} Stück verfügbar)
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-sm text-stone-600 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Tags */}
              {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5 text-xs text-stone-500">
                  {selectedProduct.tags.map((tag, idx) => (
                    <span key={idx} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-stone-200">
              {/* Quantity selector */}
              {!isOutOfStock && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-stone-600">Menge:</span>
                  <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                      aria-label="Menge verringern"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold tabular-nums text-stone-900 min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
                      disabled={quantity >= selectedProduct.stock}
                      className="p-1.5 text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                      aria-label="Menge erhöhen"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-[0.99]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{quantity}x im Warenkorb!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>In den Warenkorb ({quantity})</span>
                    </>
                  )}
                </button>

                {!isOutOfStock && (
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Sofort zur Kasse</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Service hints */}
              <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-600" />
                  <span>Lieferung in 2-3 Werktagen</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                  <span>Sichere Bezahlung</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
