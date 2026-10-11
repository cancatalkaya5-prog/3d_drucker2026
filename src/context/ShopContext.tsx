import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  CustomerInfo,
  PaymentMethod,
  OrderStatus,
  SecurityAlert,
  ChatMessage,
  SupportChatSession,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { generateBotReply, checkHumanIntent } from '../services/aiChatService';

export const STAFF_PIN = '11042014';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
  
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  cartSubtotal: number;
  discountPercent: number;
  discountCode: string;
  discountAmount: number;
  shippingFee: number;
  cartTotal: number;
  applyDiscountCode: (code: string) => boolean;
  removeDiscountCode: () => void;
  
  orders: Order[];
  createOrder: (customer: CustomerInfo, paymentMethod: PaymentMethod) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  clearCompletedOrders: () => void;
  
  viewMode: 'shop' | 'seller';
  setViewMode: (mode: 'shop' | 'seller') => void;
  
  // Staff PIN Authentication & Security Alerts
  isStaffAuthenticated: boolean;
  isPinModalOpen: boolean;
  setIsPinModalOpen: (open: boolean) => void;
  verifyStaffPin: (pin: string) => boolean;
  logoutStaff: () => void;
  securityAlerts: SecurityAlert[];
  logFailedAttempt: (attemptedPin: string) => void;
  clearSecurityAlerts: () => void;
  dismissSecurityAlert: (id: string) => void;
  
  // Customer Purchases / Tracking Modal
  isCustomerOrdersOpen: boolean;
  setIsCustomerOrdersOpen: (open: boolean) => void;

  // Support Chat with AI Bot & Human Handoff
  isSupportChatOpen: boolean;
  setIsSupportChatOpen: (open: boolean) => void;
  chatSession: SupportChatSession;
  sendCustomerMessage: (text: string) => Promise<void>;
  sendStaffMessage: (text: string) => void;
  requestHumanAgent: () => void;
  resetChat: () => void;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  latestOrder: Order | null;
  setLatestOrder: (order: Order | null) => void;
  
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'artisan_products_v1',
  CART: 'artisan_cart_v1',
  ORDERS: 'artisan_orders_v1',
  STAFF_AUTH: 'artisan_staff_auth_v1',
  SECURITY_ALERTS: 'artisan_security_alerts_v1',
  CHAT_SESSION: 'artisan_support_chat_v1',
};

const VALID_COUPONS: Record<string, number> = {
  '10PZ': 10,
  '10pz': 10,
  WILLKOMMEN10: 10,
  RABATT20: 20,
  START15: 15,
};

const INITIAL_CHAT: SupportChatSession = {
  messages: [
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: 'Hallo! 👋 Ich bin dein AI-Support-Bot von Artisan & Co. Du kannst mich alles über unsere Produkte, den Versand oder Rabatte fragen (Tipp: Mit dem Code "10pz" erhältst du 10% Rabatt!). Wenn du mit einem echten Menschen / Mitarbeiter schreiben möchtest, sag einfach Bescheid!',
      timestamp: new Date().toISOString(),
    },
  ],
  isHumanConnected: false,
  waitingForHuman: false,
  unreadCountForStaff: 0,
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // 2. Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // 3. Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // 4. Staff PIN Authentication state
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.STAFF_AUTH) === 'true';
    } catch {
      return false;
    }
  });
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // 5. Security Alerts for unauthorized PIN attempts
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECURITY_ALERTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // 6. Support Chat Session
  const [chatSession, setChatSession] = useState<SupportChatSession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_SESSION);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CHAT;
  });
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);

  // Navigation & Modals
  const [viewMode, setViewMode] = useState<'shop' | 'seller'>('shop');
  const [isCustomerOrdersOpen, setIsCustomerOrdersOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  
  // Coupons & Discounts
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync staff auth
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STAFF_AUTH, String(isStaffAuthenticated));
    } catch (e) {
      console.error(e);
    }
  }, [isStaffAuthenticated]);

  // Sync security alerts
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SECURITY_ALERTS, JSON.stringify(securityAlerts));
    } catch (e) {
      console.error(e);
    }
  }, [securityAlerts]);

  // Sync chat session
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_SESSION, JSON.stringify(chatSession));
    } catch (e) {
      console.error(e);
    }
  }, [chatSession]);

  // Sync cross-tab chat changes
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.CHAT_SESSION && e.newValue) {
        try {
          setChatSession(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Sync products to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Sync cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Sync orders to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Log unauthorized / failed PIN access attempts
  const logFailedAttempt = (attemptedPin: string) => {
    const newAlert: SecurityAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      enteredPin: attemptedPin || '(leer)',
      message: 'Der Typ auf dem PC hat versucht reinzukommen!',
      deviceInfo: typeof navigator !== 'undefined' && navigator.userAgent.includes('Windows')
        ? 'PC (Windows)'
        : typeof navigator !== 'undefined' && navigator.userAgent.includes('Mac')
        ? 'Mac'
        : 'PC / Arbeitsplatz',
    };
    setSecurityAlerts((prev) => [newAlert, ...prev]);
  };

  const clearSecurityAlerts = () => {
    setSecurityAlerts([]);
    showToast('Sicherheitsprotokoll geleert', 'info');
  };

  const dismissSecurityAlert = (id: string) => {
    setSecurityAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Staff PIN verification logic
  const verifyStaffPin = (pin: string): boolean => {
    const cleanPin = pin.trim();
    if (cleanPin === STAFF_PIN) {
      setIsStaffAuthenticated(true);
      showToast('Mitarbeiter-PIN 11042014 erfolgreich bestätigt!', 'success');
      return true;
    } else {
      logFailedAttempt(cleanPin);
      showToast('Ungültiger PIN! Zugriff verweigert und protokolliert.', 'error');
      return false;
    }
  };

  const logoutStaff = () => {
    setIsStaffAuthenticated(false);
    showToast('Mitarbeiter-Bereich gesperrt / abgemeldet', 'info');
  };

  // Support Chat actions
  const sendCustomerMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const wantsHuman = checkHumanIntent(text);

    // If human is already connected
    if (chatSession.isHumanConnected) {
      setChatSession((prev) => ({
        ...prev,
        messages: [...prev.messages, userMsg],
        unreadCountForStaff: prev.unreadCountForStaff + 1,
      }));
      return;
    }

    // If human handoff is requested by customer
    if (wantsHuman || chatSession.waitingForHuman) {
      const handoffMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: 'Verstanden! Ich leite dich sofort an unseren Shop-Mitarbeiter weiter. Er wurde benachrichtigt und übernimmt gleich persönlich diesen Chat.',
        timestamp: new Date().toISOString(),
      };

      setChatSession((prev) => ({
        ...prev,
        messages: [...prev.messages, userMsg, handoffMsg],
        waitingForHuman: true,
        unreadCountForStaff: prev.unreadCountForStaff + 1,
      }));
      showToast('🔔 Mitarbeiter im Chat angefordert! Er wurde verständigt.', 'info');
      return;
    }

    // Normal Bot response
    setChatSession((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
    }));

    try {
      const botRes = await generateBotReply(text, products);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: botRes.reply,
        timestamp: new Date().toISOString(),
      };

      setChatSession((prev) => ({
        ...prev,
        messages: [...prev.messages, botMsg],
        waitingForHuman: botRes.wantsHumanHandoff ? true : prev.waitingForHuman,
        unreadCountForStaff: botRes.wantsHumanHandoff
          ? prev.unreadCountForStaff + 1
          : prev.unreadCountForStaff,
      }));

      if (botRes.wantsHumanHandoff) {
        showToast('🔔 Kunde im Support-Chat möchte mit einem Mitarbeiter sprechen!', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendStaffMessage = (text: string) => {
    if (!text.trim()) return;
    const staffMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'human_staff',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatSession((prev) => ({
      ...prev,
      messages: [...prev.messages, staffMsg],
      isHumanConnected: true,
      waitingForHuman: false,
      unreadCountForStaff: 0,
    }));
    showToast('Antwort an Kunden gesendet!', 'success');
  };

  const requestHumanAgent = () => {
    const reqMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text: 'Ich möchte bitte mit einem echten Mitarbeiter verbunden werden.',
      timestamp: new Date().toISOString(),
    };
    const botMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'bot',
      text: 'Alles klar! Ich habe unserem Team Bescheid gegeben. Ein Mitarbeiter übernimmt den Chat in Kürze.',
      timestamp: new Date().toISOString(),
    };

    setChatSession((prev) => ({
      ...prev,
      messages: [...prev.messages, reqMsg, botMsg],
      waitingForHuman: true,
      unreadCountForStaff: prev.unreadCountForStaff + 1,
    }));
    showToast('Mitarbeiter wurde benachrichtigt!', 'info');
  };

  const resetChat = () => {
    setChatSession(INITIAL_CHAT);
    showToast('Chat zurückgesetzt', 'info');
  };

  // Cart financial calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Number(((cartSubtotal * discountPercent) / 100).toFixed(2));
  // Free shipping above 50€, else 4.90€ (or 0 if cart empty)
  const shippingFee = cart.length === 0 ? 0 : cartSubtotal >= 50 ? 0 : 4.90;
  const cartTotal = Number(Math.max(0, cartSubtotal - discountAmount + shippingFee).toFixed(2));

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`"${newProduct.title}" wurde erfolgreich eingestellt!`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...productData } : item))
    );
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === id) {
          return { ...item, product: { ...item.product, ...productData } };
        }
        return item;
      })
    );
    showToast('Artikel aktualisiert', 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
    showToast(`"${target?.title || 'Artikel'}" wurde gelöscht`, 'info');
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    setOrders([]);
    setDiscountCode('');
    setDiscountPercent(0);
    setSecurityAlerts([]);
    setChatSession(INITIAL_CHAT);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.SECURITY_ALERTS);
    localStorage.removeItem(STORAGE_KEYS.CHAT_SESSION);
    showToast('Shop wurde auf Demo-Artikel zurückgesetzt', 'info');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast('Dieser Artikel ist leider ausverkauft!', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Maximale Lagermenge (${product.stock} Stk.) erreicht.`, 'error');
          return prev;
        }
        showToast(`Menge von "${product.title}" erhöht (+${quantity})`, 'success');
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const addedQty = Math.min(quantity, product.stock);
        showToast(`"${product.title}" in den Warenkorb gelegt!`, 'success');
        return [...prev, { product, quantity: addedQty }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Artikel aus dem Warenkorb entfernt', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const max = item.product.stock;
          const targetQty = Math.min(quantity, max);
          if (quantity > max) {
            showToast(`Nur noch ${max} Stück auf Lager!`, 'error');
          }
          return { ...item, quantity: targetQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountCode('');
    setDiscountPercent(0);
  };

  // Discount Codes (Includes code 10pz for 10% and employee PIN 11042014)
  const applyDiscountCode = (code: string): boolean => {
    const cleanCode = code.trim();
    const formatted = cleanCode.toUpperCase();
    
    // Check if employee entered PIN 11042014
    if (cleanCode === STAFF_PIN) {
      setIsStaffAuthenticated(true);
      setDiscountCode('MITARBEITER-11042014');
      setDiscountPercent(25);
      showToast('Mitarbeiter-PIN 11042014 erkannt! 25% Mitarbeiterrabatt aktiviert & Mitarbeiterzugang freigeschaltet.', 'success');
      return true;
    }

    // Check code "10pz" (10% discount requested by user)
    if (formatted === '10PZ' || cleanCode.toLowerCase() === '10pz') {
      setDiscountCode('10pz');
      setDiscountPercent(10);
      showToast('Gutscheincode "10pz" aktiviert! (-10% Rabatt)', 'success');
      return true;
    }

    if (VALID_COUPONS[formatted]) {
      setDiscountCode(formatted);
      setDiscountPercent(VALID_COUPONS[formatted]);
      showToast(`Gutscheincode "${formatted}" aktiviert! (-${VALID_COUPONS[formatted]}%)`, 'success');
      return true;
    } else {
      showToast('Ungültiger Code. Probieren Sie den Code "10pz" für 10% Rabatt!', 'error');
      return false;
    }
  };

  const removeDiscountCode = () => {
    setDiscountCode('');
    setDiscountPercent(0);
    showToast('Rabattcode entfernt', 'info');
  };

  // Order creation (Checkout)
  const createOrder = (customer: CustomerInfo, paymentMethod: PaymentMethod): Order | null => {
    if (cart.length === 0) {
      showToast('Ihr Warenkorb ist leer!', 'error');
      return null;
    }

    // Check stock for all items
    for (const item of cart) {
      const currentProd = products.find((p) => p.id === item.product.id);
      if (!currentProd || currentProd.stock < item.quantity) {
        showToast(`Nicht genügend Bestand für "${item.product.title}"!`, 'error');
        return null;
      }
    }

    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      items: cart.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: cartTotal,
      discountCode: discountCode || undefined,
      customer,
      paymentMethod,
      status: 'Neu',
      createdAt: new Date().toISOString(),
    };

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.find((c) => c.product.id === prod.id);
        if (cartMatch) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - cartMatch.quantity),
          };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart and show confirmation
    clearCart();
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setLatestOrder(newOrder);

    showToast(`Bestellung #${orderNumber} erfolgreich abgeschlossen!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Bestellstatus auf "${status}" aktualisiert`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('Bestellung entfernt', 'info');
  };

  const clearCompletedOrders = () => {
    setOrders((prev) => prev.filter((o) => o.status !== 'Abgeschlossen'));
    showToast('Abgeschlossene Bestellungen wurden entfernt', 'info');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaults,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        discountPercent,
        discountCode,
        discountAmount,
        shippingFee,
        cartTotal,
        applyDiscountCode,
        removeDiscountCode,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        clearCompletedOrders,
        viewMode,
        setViewMode,
        isStaffAuthenticated,
        isPinModalOpen,
        setIsPinModalOpen,
        verifyStaffPin,
        logoutStaff,
        securityAlerts,
        logFailedAttempt,
        clearSecurityAlerts,
        dismissSecurityAlert,
        isCustomerOrdersOpen,
        setIsCustomerOrdersOpen,
        isSupportChatOpen,
        setIsSupportChatOpen,
        chatSession,
        sendCustomerMessage,
        sendStaffMessage,
        requestHumanAgent,
        resetChat,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        latestOrder,
        setLatestOrder,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
