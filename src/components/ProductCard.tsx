import React, { useState } from 'react';
import { ShoppingBag, Eye, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useShop();
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {!imgError && product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-stone-400 bg-stone-100">
            <span className="text-3xl mb-2">📦</span>
            <span className="text-xs font-medium text-stone-500 text-center">{product.title}</span>
          </div>
        )}

        {/* Subtle Discount / Featured indicator */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {hasDiscount && (
            <span className="bg-stone-900 text-white text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide">
              Sale -{Math.round((1 - product.price / product.originalPrice!) * 100)}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-amber-100 text-amber-900 text-[11px] font-medium px-2 py-0.5 rounded">
              Empfehlung
            </span>
          )}
        </div>

        {/* Hover Quick View Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
          }}
          aria-label={`Details zu ${product.title} ansehen`}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-stone-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-stone-900 shadow-sm"
        >
          <Eye className="w-4 h-4" />
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center text-white text-sm font-semibold tracking-wide">
            Ausverkauft
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata: Category & Stock notice (Unboxed text with bullet separator) */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-medium uppercase tracking-wider text-[11px]">{product.category}</span>
            {isLowStock && (
              <span className="text-amber-700 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Nur noch {product.stock} da
              </span>
            )}
            {!isLowStock && !isOutOfStock && (
              <span className="text-emerald-700 font-medium">Auf Lager ({product.stock})</span>
            )}
          </div>

          <h3 className="font-semibold text-stone-900 text-base leading-snug line-clamp-1 group-hover:text-stone-700 transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom Bar: Price & Add to Cart button */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-stone-900 tabular-nums">
              {product.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {product.originalPrice?.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`${product.title} in den Warenkorb`}
            className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm active:scale-95'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Hinzugefügt</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Kaufen</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
