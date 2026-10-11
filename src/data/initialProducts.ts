import hoodieImg from '../assets/images/product_nordic_hoodie_1791639766940.jpg';
import leatherBagImg from '../assets/images/product_leather_bag_1791639778910.jpg';
import headphonesImg from '../assets/images/product_audio_headphones_1791639789714.jpg';
import ceramicMugImg from '../assets/images/product_ceramic_mug_1791639798908.jpg';
import heroShopImg from '../assets/images/hero_lifestyle_shop_1791639754618.jpg';
import { Product, PresetImage } from '../types';

export { heroShopImg };

export const PRESET_IMAGES: PresetImage[] = [
  { name: 'Anthrazit Bio-Hoodie', url: hoodieImg, category: 'Bekleidung' },
  { name: 'Klassische Ledertasche', url: leatherBagImg, category: 'Accessoires' },
  { name: 'ANC Studio Kopfhörer', url: headphonesImg, category: 'Audio & Technik' },
  { name: 'Handgefertigte Keramiktasse', url: ceramicMugImg, category: 'Wohnen & Lifestyle' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    title: 'Finn & Co. Heavyweight Bio-Hoodie',
    description: 'Hochwertiger Kapuzenpullover aus 100% gekämmter Bio-Baumwolle (450 g/m²). Weicher Griff, vorgewaschener Vintage-Wash in Anthrazit mit robuster Doppelnähte-Verarbeitung für langlebigen Tragekomfort.',
    price: 89.0,
    originalPrice: 109.0,
    category: 'Bekleidung',
    imageUrl: hoodieImg,
    stock: 18,
    sku: 'ART-HD-001',
    tags: ['Bio-Baumwolle', 'Unisex', 'Bestseller'],
    isFeatured: true,
    createdAt: '2026-10-01T10:00:00.000Z',
  },
  {
    id: 'prod-002',
    title: 'Vannier Atelier Ledertasche "Atelier"',
    description: 'Traditionell handgenähte Umhängetasche aus pflanzlich gegerbtem Vollrindleder mit massiven Messingschnallen. Entwickelt mit den Jahren eine edle, persönliche Patina. Fach für Laptops bis 14 Zoll.',
    price: 185.0,
    category: 'Accessoires',
    imageUrl: leatherBagImg,
    stock: 8,
    sku: 'ART-BG-002',
    tags: ['Echtleder', 'Handarbeit', 'Langlebig'],
    isFeatured: true,
    createdAt: '2026-10-02T11:30:00.000Z',
  },
  {
    id: 'prod-003',
    title: 'Studio Acoustic Wireless ANC Kopfhörer',
    description: 'Erstklassige kabellose Over-Ear-Kopfhörer mit aktiver Geräuschunterdrückung (ANC), 40mm Beryllium-Treibern und bis zu 38 Stunden Akkulaufzeit. Ergonomische Memory-Schaum Ohrpolster für ganztägigen Sitz.',
    price: 249.0,
    originalPrice: 289.0,
    category: 'Audio & Technik',
    imageUrl: headphonesImg,
    stock: 12,
    sku: 'ART-HP-003',
    tags: ['ANC', 'Bluetooth 5.3', 'Hi-Res Audio'],
    isFeatured: true,
    createdAt: '2026-10-03T09:15:00.000Z',
  },
  {
    id: 'prod-004',
    title: 'Kinto Speckled Steinzeug-Keramiktasse (350ml)',
    description: 'Handgetöpferte Kaffeetasse aus feinem Steinzeug mit gesprenkelter Glasur in Naturcreme. Hitzebeständig, mikrowellengeeignet und spülmaschinenfest. Jedes Stück ist ein unverwechselbares Unikat.',
    price: 24.5,
    category: 'Wohnen & Lifestyle',
    imageUrl: ceramicMugImg,
    stock: 35,
    sku: 'ART-MG-004',
    tags: ['Handarbeit', 'Steinzeug', 'Küche'],
    isFeatured: false,
    createdAt: '2026-10-04T14:45:00.000Z',
  },
];

export const CATEGORIES = [
  'Alle',
  'Bekleidung',
  'Accessoires',
  'Audio & Technik',
  'Wohnen & Lifestyle',
];
