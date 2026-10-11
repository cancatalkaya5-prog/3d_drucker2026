import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { Product } from '../../types';
import { PRESET_IMAGES, CATEGORIES } from '../../data/initialProducts';
import { useShop } from '../../context/ShopContext';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, products } = useShop();

  // Extract distinct category list
  const existingCategories = Array.from(
    new Set([...CATEGORIES.filter((c) => c !== 'Alle'), ...products.map((p) => p.category)])
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('29.90');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [category, setCategory] = useState<string>(existingCategories[0] || 'Bekleidung');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [stock, setStock] = useState<number>(10);
  const [sku, setSku] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>(PRESET_IMAGES[0]?.url || '');
  const [tags, setTags] = useState<string>('Neuheit, Handarbeit');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [imageInputMode, setImageInputMode] = useState<'preset' | 'url' | 'upload'>('preset');

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price.toString());
      setOriginalPrice(productToEdit.originalPrice ? productToEdit.originalPrice.toString() : '');
      setCategory(productToEdit.category);
      setStock(productToEdit.stock);
      setSku(productToEdit.sku);
      setImageUrl(productToEdit.imageUrl);
      setTags(productToEdit.tags?.join(', ') || '');
      setIsFeatured(!!productToEdit.isFeatured);
    } else {
      // Defaults for brand new product
      setTitle('');
      setDescription('');
      setPrice('39.00');
      setOriginalPrice('');
      setCategory(existingCategories[0] || 'Bekleidung');
      setStock(15);
      setSku(`ART-${Math.floor(100 + Math.random() * 900)}`);
      setImageUrl(PRESET_IMAGES[0]?.url || '');
      setTags('Handarbeit, Neuheit');
      setIsFeatured(false);
      setImageInputMode('preset');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = category === '__NEW__' ? customCategory.trim() || 'Allgemein' : category;
    const finalPrice = Math.max(0.01, parseFloat(price) || 0);
    const finalOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
    const finalTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const productPayload = {
      title: title.trim(),
      description: description.trim(),
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      category: finalCategory,
      imageUrl: imageUrl.trim() || PRESET_IMAGES[0]?.url,
      stock: Math.max(0, stock),
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      tags: finalTags,
      isFeatured,
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div>
            <h2 className="font-serif font-bold text-lg text-stone-900">
              {productToEdit ? 'Artikel bearbeiten' : 'Neuen Artikel hinzufügen'}
            </h2>
            <p className="text-xs text-stone-500">
              {productToEdit ? 'Passe Preise, Bestand oder Angaben an.' : 'Füge ein neues Produkt zu deinem Online-Shop hinzu.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          
          {/* Article Name */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Artikelname / Titel *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Wollschal aus Merinowolle"
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none"
            />
          </div>

          {/* Pricing & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Verkaufspreis (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.00"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none tabular-nums"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Streichpreis (€) <span className="text-stone-400 font-normal">Optional</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="69.00"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none tabular-nums"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">Lagerbestand (Stück) *</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none tabular-nums"
              />
            </div>
          </div>

          {/* Category selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">Kategorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none bg-white"
              >
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__NEW__">+ Neue Kategorie erstellen...</option>
              </select>
            </div>

            {category === '__NEW__' && (
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Name der neuen Kategorie *</label>
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="z.B. Schmuck & Uhren"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-stone-700 font-medium mb-1">Artikelnummer / SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="ART-009"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none font-mono"
              />
            </div>
          </div>

          {/* Image Selection Section */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <label className="block text-stone-800 font-semibold mb-2 flex items-center justify-between">
              <span>Produktbild auswählen</span>
              <div className="flex gap-2 text-[11px] font-normal">
                <button
                  type="button"
                  onClick={() => setImageInputMode('preset')}
                  className={`px-2 py-0.5 rounded ${imageInputMode === 'preset' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  Katalog-Vorlagen
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-2 py-0.5 rounded ${imageInputMode === 'upload' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  Vom PC hochladen
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-2 py-0.5 rounded ${imageInputMode === 'url' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  Bild-URL
                </button>
              </div>
            </label>

            {/* Mode 1: Presets */}
            {imageInputMode === 'preset' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRESET_IMAGES.map((preset, idx) => {
                  const isSelected = imageUrl === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                        isSelected ? 'border-stone-900 ring-2 ring-stone-900/20' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center text-white">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1 right-1 bg-stone-900/80 text-white text-[9px] px-1 py-0.5 rounded truncate">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Mode 2: File Upload */}
            {imageInputMode === 'upload' && (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-lg p-6 bg-white hover:bg-stone-50 transition-colors">
                <Upload className="w-6 h-6 text-stone-400 mb-2" />
                <span className="text-stone-700 font-medium mb-1">Bilddatei auswählen (PNG, JPG, WebP)</span>
                <span className="text-stone-400 text-[11px] mb-3">Wird direkt in deinem Browser verarbeitet</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-stone-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-stone-900 file:text-white hover:file:bg-stone-800"
                />
              </div>
            )}

            {/* Mode 3: Image URL */}
            {imageInputMode === 'url' && (
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.example.com/mein-produkt.jpg"
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none bg-white"
                />
              </div>
            )}

            {/* Image Preview */}
            {imageUrl && (
              <div className="mt-3 flex items-center gap-3 p-2 bg-white rounded-lg border border-stone-200">
                <img
                  src={imageUrl}
                  alt="Vorschau"
                  className="w-12 h-12 object-cover rounded border border-stone-200"
                  onError={() => {}}
                />
                <span className="text-stone-600 truncate flex-1 text-[11px]">Aktuelle Bildauswahl aktiv</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-stone-700 font-semibold mb-1">Beschreibung des Artikels *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibe Materialien, Maße, Besonderheiten und Vorteile deines Produkts..."
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none resize-none"
            />
          </div>

          {/* Tags & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Tags (kommagetrennt)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="z.B. Bio, Nachhaltig, Sommer"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 outline-none"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
                />
                <span className="text-stone-800 font-medium">Als Bestseller/Highlight hervorheben</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-sm"
            >
              {productToEdit ? 'Änderungen speichern' : 'Artikel jetzt veröffentlichen'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
